import type { LanguageAdapter } from "../languages/types.js";
import { checkParam, checkReturn, parseCType } from "./ctype.js";
import type { ContractFunction, Issue, NativeSymbol } from "./model.js";

/**
 * Compare a native symbol to the contract signature ("input API -> output API").
 *
 * The contract is read from the caller's point of view: a call written against the
 * contract (positional args, optional ones may be omitted) must work against the lib,
 * and whatever the lib returns must be something the contract allows.
 */
function checkSignature(fn: ContractFunction, symbol: NativeSymbol, adapter: LanguageAdapter): Issue[] {
  const spread = spreadOptions(fn, symbol, adapter);
  if (!spread) return checkFlat(fn, symbol, adapter);
  const options = fn.params[spread.index];
  const fields = spread.fields.map((name) => {
    const f = options.fields!.find((x) => x.name === name)!;
    return { ...f, name: `${options.name}.${f.name}`, optional: true };
  });
  return [
    { severity: "info", code: "spread-options", message: `takes ${fields.map((f) => f.name).join(", ")} as separate parameters` },
    ...checkFlat({ ...fn, params: [...fn.params.slice(0, spread.index), ...fields] }, symbol, adapter)
  ];
}

/**
 * A lib that takes the fields of the contract's options object as separate parameters (Go and
 * Rust have no options objects; many Python and Ruby APIs use positional or keyword arguments):
 * `isValid(value, { format })` in the contract, `IsValid(plate string, plateType string)` in Go.
 * Returns which contract field each of the lib's trailing parameters stands for (matched by name,
 * then in order), or undefined when the lib takes the object itself or has no such parameters.
 */
export function spreadOptions(fn: ContractFunction, symbol: NativeSymbol, adapter: LanguageAdapter): { index: number; fields: string[] } | undefined {
  const index = fn.params.length - 1;
  const options = fn.params[index];
  if (!options?.fields?.length) return undefined;
  const trailing = symbol.params.filter((p) => !p.rest).slice(index);
  if (trailing.length === 0 || trailing.length > options.fields.length) return undefined;
  if (checkParam(parseCType(options.type), adapter.mapType(trailing[0].typeNode, "param", symbol)).level !== "error") return undefined;
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
  const left = options.fields.map((f) => f.name);
  const named = trailing.map((p) => {
    const n = norm(p.name);
    const hit = left.find((f) => n === norm(f));
    if (hit) left.splice(left.indexOf(hit), 1);
    return hit;
  });
  return { index, fields: named.map((f) => f ?? left.shift()!) };
}

/** The arguments of a contract call as the lib takes them (an options object spread, see above). */
export function nativeArgs(fn: ContractFunction, symbol: NativeSymbol, adapter: LanguageAdapter, args: unknown[]): unknown[] {
  const spread = spreadOptions(fn, symbol, adapter);
  const options = spread && args[spread.index];
  if (!spread || args.length <= spread.index || !options || typeof options !== "object" || Array.isArray(options)) return args;
  const values = spread.fields.map((f) => (options as Record<string, unknown>)[f]);
  while (values.length && values[values.length - 1] === undefined) values.pop();
  return [...args.slice(0, spread.index), ...values.map((v) => (v === undefined ? null : v))];
}

function checkFlat(fn: ContractFunction, symbol: NativeSymbol, adapter: LanguageAdapter): Issue[] {
  const issues: Issue[] = [];
  const positional = symbol.params.filter((p) => !p.rest && !p.keyword);
  const hasRest = symbol.params.some((p) => p.rest && !p.keyword);
  const requiredKeywords = symbol.params.filter((p) => p.keyword && !p.optional && !p.rest);
  const nativeRequired = positional.filter((p) => !p.optional).length;
  const contractRequired = fn.params.filter((p) => !p.optional).length;
  const contractTotal = fn.params.length;
  let unverified = 0;

  if (requiredKeywords.length > 0) {
    issues.push({
      severity: "error",
      code: "required-keyword",
      message: `requires keyword argument(s) ${requiredKeywords.map((p) => p.name).join(", ")} that the contract does not have`
    });
  }
  if (nativeRequired > contractTotal) {
    // Callers following the contract cannot supply these arguments at all.
    issues.push({
      severity: "error",
      code: "arity",
      message: `requires ${nativeRequired} argument(s), contract passes at most ${contractTotal} (${sig(fn)})`
    });
  } else if (!hasRest && positional.length < contractRequired) {
    issues.push({
      severity: "error",
      code: "arity",
      message: `accepts ${positional.length} argument(s), contract requires ${contractRequired} (${sig(fn)})`
    });
  }

  fn.params.forEach((cp, i) => {
    const np = positional[i];
    if (!np) {
      if (cp.optional && !hasRest && positional.length >= contractRequired) {
        issues.push({ severity: "warning", code: "missing-optional-param", message: `does not support optional parameter "${cp.name}"` });
      }
      return;
    }
    if (cp.optional && !np.optional) {
      issues.push({
        severity: adapter.optionalParams === false ? "warning" : "error",
        code: "param-required",
        message: `parameter "${np.name}" (contract "${cp.name}") is required, contract makes it optional`
      });
    }
    const result = checkParam(parseCType(cp.type), adapter.mapType(np.typeNode, "param", symbol));
    if (result.level === "unverified") unverified++;
    else if (result.level !== "ok") {
      issues.push({ severity: result.level, code: "param-type", message: `parameter "${cp.name}": ${result.reason}` });
    }
  });

  const ret = checkReturn(parseCType(fn.returns), adapter.mapType(symbol.returnsNode, "return", symbol));
  if (ret.level === "unverified") unverified++;
  else if (ret.level !== "ok") issues.push({ severity: ret.level, code: "return-type", message: `return: ${ret.reason}` });

  if (unverified > 0) {
    issues.push({
      severity: "info",
      code: "unverified-types",
      message: `${unverified} type(s) could not be verified statically (untyped or unmapped native types)`
    });
  }
  return issues;
}

/** `cpf: string, strict?: boolean`: a contract function's parameters as text. */
export const paramList = (params: ContractFunction["params"]) => params.map((p) => `${p.name}${p.optional ? "?" : ""}: ${p.type}`).join(", ");

export function sig(fn: ContractFunction): string {
  return `${fn.flatName}(${paramList(fn.params)}) -> ${fn.returns}`;
}

export function nativeSig(s: NativeSymbol): string {
  const params = s.params
    .map((p) => `${p.rest ? "..." : ""}${p.name}${p.optional ? "?" : ""}${p.type ? `: ${p.type}` : ""}`)
    .join(", ");
  return `${s.name}(${params})${s.returns ? ` -> ${s.returns}` : ""}`;
}

/**
 * Whether a call passing only the contract's required arguments works against `symbol`: the
 * signature errors, if any, all come from optional parameters.
 */
export function requiredParamsCompatible(fn: ContractFunction, symbol: NativeSymbol, adapter: LanguageAdapter): boolean {
  const required = fn.params.filter((p) => !p.optional);
  if (required.length === fn.params.length) return false;
  return !checkSignature({ ...fn, params: required }, symbol, adapter).some((i) => i.severity === "error");
}

/** Pick the overload with the fewest errors, then warnings. */
export function bestOverload(fn: ContractFunction, overloads: NativeSymbol[], adapter: LanguageAdapter) {
  const scored = overloads.map((symbol) => {
    const issues = checkSignature(fn, symbol, adapter);
    const errors = issues.filter((i) => i.severity === "error").length;
    const warnings = issues.filter((i) => i.severity === "warning").length;
    return { symbol, issues, rank: errors * 100 + warnings };
  });
  scored.sort((a, b) => a.rank - b.rank);
  return scored[0];
}

