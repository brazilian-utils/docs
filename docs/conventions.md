# Cross-cutting conventions

Use this page to learn the rules that apply to every contract function. A function can
override a rule in its `description` in `contract/<domain>/contract.json`. The rules come from the
"Conventions" section of the reference (JavaScript) docs. We checked them against what the
libraries actually do (`docs check --tests` and `diff`, recorded in
[findings.md](findings.md)).

Status:

- **Agreed**: the contract and every library that implements the functions already behave
  this way.
- **Pending decision**: the libraries disagree. The rule shown is what the reference (JS)
  does. The rule is not settled until someone decides the linked finding and adds its case to
  the contract.
- **Reference only**: only the reference library implements or documents the rule. The
  harness has not compared it across libraries yet. New implementations should follow it.

"null" means the "no result" value of the language, as in
[contract.md](contract.md#test-ids-and-values): `null`, `None`, `nil`, `Option::None` or
`{error, _}`.

## Summary

| # | Convention | Status |
|---|---|---|
| 1 | Validators return false on bad input and never fail; lookups never fail either | Agreed |
| 2 | Formatters on empty, garbage or incomplete input | Pending decision ([§2 #2, #3](findings.md#2-decisions-needed-not-encoded-yet)) |
| 3 | Single-item lookups return null when nothing matches | Pending decision ([§2 #6](findings.md#2-decisions-needed-not-encoded-yet)) |
| 4 | List lookups return an empty list when nothing matches | Reference only |
| 5 | Network functions fail with an error instead of returning null | Reference only |
| 6 | Validators accept masked input | Pending decision ([§2 #1](findings.md#2-decisions-needed-not-encoded-yet)) |
| 7 | Formatters mask as far as the value goes (usable as input masks) | Pending decision ([§2 #2](findings.md#2-decisions-needed-not-encoded-yet)) |
| 8 | `parse` keeps only the meaningful characters and caps the length | Reference only |
| 9 | Generated values are unformatted and pass the library's own validator | Agreed |
| 10 | Generators are not cryptographically secure | Reference only |
| 11 | Reserved numbers (all digits the same) are invalid | Agreed for CPF and CNPJ. Pending decision for PIS ([§1](findings.md#1-cases-in-the-contract-that-some-libraries-fail)) |
| 12 | Lookups return fresh values | Reference only |
| 13 | Only network functions are asynchronous | Agreed |
| 14 | Text written out in words ("por extenso") is lower case | Pending decision ([§1b](findings.md#1b-found-by-the-506-cases-added-from-the-js-reference-tests)) |
| 15 | Optional behaviors are optional parameters (`options`) | Pending decision ([§2](findings.md#2-decisions-needed-not-encoded-yet), API shape) |
| 16 | A number is read only when it is a safe non-negative integer | Reference only |
| 17 | State codes (UF) are case-insensitive and trimmed | Reference only |
| 18 | `stateCode` in the holiday and business-day functions: national, state or rejected | Reference only |
| 19 | A getter returns null exactly when its validator returns false | Reference only |

## Details

1. **Validators never fail on bad input.** `*.isValid` returns false for an empty string,
   whitespace or garbage, and never raises. Offline lookups (`*.get*`, `*.list*`) never raise either:
   they return null or an empty list (rules 3 and 4). The `isValid` cases of the contract for `""`,
   `"   "` and `"abc"` pass in every library.

2. **Formatters on bad input.** The reference returns an empty string for empty or garbage
   input. It masks an incomplete value as far as it goes (`"123"` gives `"123"`). Go and .NET
   do the same. Python, Ruby, Rust and Erlang return null for anything that is not a complete,
   valid value. For this reason, `format` returns `string?` in those libraries and `string` in
   the contract. The vote does not cover some functions yet: `currency.format` and
   `date.convertToWords` (§2 #9), `licensePlate.convertToMercosul` (§2 #5), and `phone.format`
   and `passport.format` on empty input.

3. **Single-item lookups** (`*.get`, `*.getInfo`, `*.getBy*`) return null when nothing matches.
   Go returns `""` for an unknown legal nature code (`legalNature.getDescription`). Python,
   Ruby and Rust return null. See also rule 19.

4. **List lookups** (`*.list`, `*.listBy*`, `date.getHolidays`) return an empty list for an
   unknown filter or out-of-range input, never null.

5. **Network functions** (`network: true` in the contract: `cep.getAddressInfo`,
   `cep.getInfoByAddress`) fail with an error for invalid input, "not found" and service
   failures. The caller can tell the error kinds apart. These functions are the exception to
   rules 1 to 4. Tests and `diff` skip network calls, so nobody has compared the other
   libraries yet.

6. **Masked input to validators.** The reference ignores the usual mask characters (`.`, `-`,
   `/`) and whitespace around and between groups. So the caller does not have to remove them
   first. JS, Go and .NET accept `821.785.374-64`. Python, Ruby, Rust and Erlang accept digits
   only. The rule applies to `cpf`, `cnpj`, `cep`, `pis` and `voterId`. The description of each
   function lists the separators it accepts (for example, `voterId.isValid` rejects hyphens).

7. **Formatters as input masks.** The reference masks partial values, so you can apply a
   formatter on every keystroke. This depends on decision 2.

8. **Parsers** (`*.parse`) do the reverse of `format`. They keep only the meaningful
   characters (digits, or upper-cased letters and digits for alphanumeric documents). They cap
   the result at the length of the document. They add no padding.

9. **Generators** (`*.generate`) return the unformatted value (digits only, or upper-case
   alphanumerics). The result passes the library's own `isValid`. `satisfies` cases
   encode this rule. In Go and Rust, some generators take a required argument that the
   contract makes optional. That is a difference in API shape and does not change the output.

10. **Generators use a non-cryptographic random source.** They are for tests and fixtures,
    never for anything related to security. The reference documents this. Nobody has checked
    the other libraries.

11. **Reserved numbers.** A CPF or CNPJ whose digits are all the same is invalid, also when
    its check digits match. Every library agrees. For PIS, the reference (JS) also rejects
    such numbers, and the other six libraries accept them (findings §1).

12. **Lookups return fresh values.** Every object or list a function returns is a new copy. A
    change to it never affects the next call or the library's own tables. In languages with
    immutable data, the rule is always true.

13. **Synchronous API.** Every function returns its result directly. The exception is the
    network functions of rule 5. They can be asynchronous where the language has an idiom for
    it.

14. **Words output.** The reference writes `currency.convertToWords` and `date.convertToWords`
    in lower case with no comma between groups ("mil quinhentos e vinte e três reais…"). For
    currency, .NET, Go, Python and Ruby capitalize the first word, and .NET, Go and Python add
    commas. For dates, Go and Ruby capitalize.

15. **Optional behaviors.** In the reference, optional behaviors (padding, obfuscation,
    version, mask, precision…) go in a single options object. Other libraries take positional
    optional parameters or do not have the behavior. The contract lists them as one optional
    `options` parameter. When it lists the object's `fields`, a library that takes them as
    separate parameters (Go `IsValid(plate, plateType)`, Python `is_valid(plate, type=None)`)
    matches too: the validator pairs each field with a parameter by name, then in order, and
    the tests pass the values positionally. People also disagree about some defaults: the
    default phone mask (§2 #4) and whether `currency.format` adds `R$` (§1b).

16. **Numbers as input.** Every function that takes `string | number` reads a number only when
    it is a safe non-negative integer. A negative, fractional, non-finite or unsafe number is
    invalid input: validators return false, formatters return `""`, parsers return `""` and
    lookups return null. Strings and safe non-negative integers give the same results as
    before. Until 2.4.0 the reference read some negative or fractional numbers by their digits
    (`formatNcm(-84713012)` gave `8471.30.12`, `isValidRenavam(-639884962)` gave true).

17. **State codes.** Every function that takes a state code (UF) ignores case and surrounding
    whitespace: `"sp"`, `" SP "` and `"Sp"` all mean `"SP"`. This covers the municipality,
    area code, state, holiday and business-day functions, and the generators that take a state
    (`cpf.generate`, `voterId.generate`), and `registroProfissional.isValid`. `ie.isValid` ignores
    case but not surrounding whitespace (`" sp "` is rejected). Until 2.4.0,
    `municipality.list("sp")` returned an empty list and the holiday functions read `"sp"` as
    no state.

18. **`stateCode` in the holiday and business-day functions** (`date.getHolidays`,
    `date.isHoliday`, `date.isBusinessDay`, `date.addBusinessDays`, `date.subBusinessDays`,
    `date.differenceInBusinessDays`). Without `stateCode`, only national holidays count. A valid
    state code, in any case, adds that state's holidays. Any other value is rejected with the
    function's "no result": `getHolidays` returns `[]`, `isHoliday` and `isBusinessDay` return
    false, and the three business-day calculations return null. Until 2.4.0, an unknown or
    lower-case code silently fell back to the national holidays. Municipal holidays are never
    included.

19. **Getters follow their validator.** For every pair `isValidX` / `getX` (or `getXInfo`),
    `getX(v)` is null exactly when `isValidX(v)` is false. Most getters call the validator
    first. `classTrib.get`, `cid10.get` and `legalNature.get` do their own lookup to keep the
    validator small, with the same result.
