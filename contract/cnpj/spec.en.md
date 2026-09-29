---
id: cnpj
title: "CNPJ"
language: en-US
references:
  - in-rfb-2119-2022
  - in-rfb-2229-2024
---

# CNPJ: Brazilian Company Registration Number

## Summary

The CNPJ is a unique identification number that the Brazilian Federal Revenue Service issues. It registers companies, public agencies and other entities in Brazil. It has 14 characters: 8 for the root, 4 for the order of the establishment and 2 check digits. CNPJs issued before the alphanumeric format started contain only digits. Since July 2026, new registrations can contain uppercase letters and digits in the first 12 characters. The 2 check digits stay numeric only.

## Validation rules

1. The input must contain exactly 14 characters.
2. The first 12 characters can contain digits from `0` to `9` and letters from `A` to `Z`. With `version: 2`, validation reads lowercase letters as uppercase.
3. The last 2 characters are the check digits and must be numeric.
4. The check digits must come from the modulo 11 algorithm.
5. To calculate the check digits, convert the first 12 characters into numeric values. Use the decimal ASCII code of each character and subtract 48.

   Examples:
   - `0` → `48 - 48 = 0`
   - `9` → `57 - 48 = 9`
   - `A` → `65 - 48 = 17`
   - `B` → `66 - 48 = 18`
   - `Z` → `90 - 48 = 42`

## Algorithm

1. Check that the input contains exactly 14 characters.
2. Check that the first 12 characters are alphanumeric and the last 2 are numeric.
3. Convert the alphanumeric characters to numeric values:
   - Digits keep their original values.
   - Letters become their decimal ASCII values minus `48`.
4. Calculate the first check digit (DV1):
   - For the first 12 characters, give weights from `2` to `9` from right to left. Start again at `2` after weight `9`.
   - Multiply each value by its weight and add the results.
   - Calculate the remainder of the sum divided by `11`.
   - If the remainder is `0` or `1`, DV1 is `0`. If not, DV1 is `11 - remainder`.
5. Calculate the second check digit (DV2):
   - Add DV1 to the end of the sequence. For these 13 characters, give weights from `2` to `9` from right to left.
   - Multiply each value by its weight and add the results.
   - Calculate the remainder of the sum divided by `11`.
   - If the remainder is `0` or `1`, DV2 is `0`. If not, DV2 is `11 - remainder`.
6. Compare the calculated check digits with the last two characters of the CNPJ.

## Fields of the number

IN RFB nº 2.229/2024 (Anexo XV of IN RFB nº 2.119/2022) lays the 14 positions out as:

| Positions | Field | `getCnpjInfo` key |
|---|---|---|
| 1 to 8 | root (raiz), shared by every establishment of the entity | `root` |
| 9 to 12 | número de ordem of the establishment | `branch` |
| 13 and 14 | check digits, always numeric | `checkDigits` |

- `getCnpjInfo(value, { version })` returns these fields and `isInitialHeadquarters`. It returns `null` exactly when `isValidCnpj(value, { version })` is `false`, so an alphanumeric CNPJ read under version 1 gives `null`. The fields of an alphanumeric CNPJ come back in upper case. The result has no `format` field.
- `isInitialHeadquarters` is `true` when the branch is `0001`. The Receita Federal gives `0001` to the headquarters (matriz) when the root is registered. A filial can later become the matriz without having the branch `0001` (question 25 of the Receita Federal Q&A on the alphanumeric CNPJ), so the flag only says what the number said at creation.
- `generateCnpj({ branch })` uses the same name. A random branch is never `0000`, since establishments are numbered from `0001`. 2.4.0 could return `0000` (about once in 10,000 numeric CNPJs).

Examples:

- `getCnpjInfo("12.345.678/0001-95")` returns `{ root: "12345678", branch: "0001", checkDigits: "95", isInitialHeadquarters: true }`.
- `getCnpjInfo("12.abc.345/01de-35", { version: 2 })` returns `{ root: "12ABC345", branch: "01DE", checkDigits: "35", isInitialHeadquarters: false }`.
- `getCnpjInfo("12.ABC.345/01DE-35")` returns `null` (alphanumeric, read under version 1).

## Masking and numbers

- `formatCnpj(value, { obfuscate: true })` hides the first 2 characters and the 2 check digits (`**.345.678/0001-**`). This is a convention of the library, with no official source: no law or Receita Federal act sets a masking rule for the CNPJ, whose data are public. It follows the rule the Leis de Diretrizes Orçamentárias set for the CPF.
- `formatCnpj` and `parseCnpj` also take a number. It is read only when it is a non-negative safe integer. A negative, fractional, non-finite or unsafe number returns an empty string. 2.4.0 read the digits of any number.

## Regex

- Unformatted CNPJ: `^[A-Z0-9]{12}[0-9]{2}$`
- Formatted CNPJ: `^[A-Z0-9]{2}\.[A-Z0-9]{3}\.[A-Z0-9]{3}/[A-Z0-9]{4}-[0-9]{2}$`

## Examples

- Valid: `03560714000142` (valid numeric CNPJ)
- Valid: `9359QAG9000184` (valid alphanumeric CNPJ)
- `03.560.714/0001-42`: pending decision. The reference (JS) accepts it, the other libraries do not.
- Invalid: `00111222000133` (invalid check digits)
- Invalid: `12ABC34501DE3X` (the check digits must be numeric)
- Invalid: `12ABC34501DE3` (must contain exactly 14 characters)
- Invalid: `12ABC34501DE345` (must contain exactly 14 characters)
