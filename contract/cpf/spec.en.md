---
id: cpf
title: "CPF"
language: en-US
references:
  - IN RFB nº 2.172/2024
  - law 14.534/2023
  - Receita Federal, folheto "Cadastros: CPF e CNPJ"
  - Manual de Preenchimento da e-Financeira (REGRA_VALIDA_CPF)
---

# CPF: Brazilian Individual Taxpayer Registry

## Summary

The CPF is an 11-digit national identification number. The first eight digits are the registration number, assigned at random. The ninth digit identifies the Fiscal Region responsible for the registration. The last two digits are check digits. Since January 2023, Brazil has used the CPF as its single identification number.

## Validation rules

1. The input must contain exactly 11 characters.
2. The check digits come from the standard mod-11 algorithm.
3. Sequences with all digits equal (for example, `00000000000`) are invalid.

## Algorithm

1. Reject the input if its length != 11 or if it is a repeated sequence.
2. Calculate the first check digit (DV1):
   - Multiply the first 9 digits by the weights 10..2.
   - Add the results.
   - DV1 = (sum % 11 < 2 ? 0 : 11 - (sum % 11))
3. Calculate the second check digit (DV2):
   - Multiply the first 10 digits (including DV1) by the weights 11..2.
   - Add the results.
   - DV2 = (sum % 11 < 2 ? 0 : 11 - (sum % 11))
4. Compare DV1 and DV2 with the last two digits.

## Sources of the rules

- The norm of the CPF, IN RFB nº 2.172/2024, does not define the check digits.
- The check digit rule (REGRA_VALIDA_CPF) and the worked example `280.012.389-38` come from the Receita Federal Manual de Preenchimento da e-Financeira, approved by Ato Declaratório Executivo Cofis nº 10/2026.
- The reserved numbers (all 11 digits the same, `000.000.000-00` to `999.999.999-99`) come from the Receita Federal DJE layout, which lists them as not valid.
- The obfuscated form of `formatCpf` (`***.456.789-**`) follows the rule the Leis de Diretrizes Orçamentárias set for publishing a CPF: Lei nº 14.194/2021, art. 149, repeated by Lei nº 15.321/2025 (LDO 2026), art. 163.

## Fiscal region (9th digit)

The 9th digit is the Região Fiscal of the Receita Federal of the address given when the CPF was first registered. `1` to `9` are the 1st to 9th regions, and `0` is the 10th.

| Digit | States |
|---|---|
| 1 | DF, GO, MT, MS, TO |
| 2 | AC, AP, AM, PA, RO, RR |
| 3 | CE, MA, PI |
| 4 | AL, PB, PE, RN |
| 5 | BA, SE |
| 6 | MG |
| 7 | ES, RJ |
| 8 | SP |
| 9 | PR, SC |
| 0 | RS |

- The digit is not the place of birth or of residence. It is the region of the address at the first registration.
- In a region with more than one state, the number does not say which one.
- `getCpfInfo` returns `{ base, fiscalRegion, states, checkDigits }`: the first 8 digits, the 9th digit as a string, the states of that region sorted by state name, and the 2 check digits. It returns `null` exactly when `isValidCpf` is `false`.
- `generateCpf(state)` writes the digit of the region of `state`. The state code is read ignoring case and surrounding whitespace (`"sp"` is `SP`). 2.4.0 read only the uppercase code.

Example: `getCpfInfo("123.456.789-09")` returns `{ base: "12345678", fiscalRegion: "9", states: ["PR", "SC"], checkDigits: "09" }`.

## Numbers as input

`formatCpf` and `parseCpf` also take a number. It is read only when it is a safe non-negative integer. A negative, fractional, non-finite or unsafe number gives an empty string. 2.4.0 read the digits of any number.

## Regex

- Unformatted CPF: `^\d{11}$`
- Formatted CPF: `^\d{3}\.\d{3}\.\d{3}-\d{2}$`

## Examples

- Valid: `11144477735`
- `111.444.777-35`: pending decision. The reference (JS) accepts it, the other libraries do not.
- Invalid: `00000000000` (repeated sequence)
- Invalid: `1114447773` (must contain exactly 11 characters)
- Invalid: `111444777355` (must contain exactly 11 characters)
