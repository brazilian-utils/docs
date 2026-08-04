---
id: cnpj
title: "CNPJ"
language: en-US
references:
  - in-rfb-2119-2022
  - in-rfb-2229-2024
---

# CNPJ — Brazilian Company Registration Number

## Summary

CNPJ is a unique identification number issued by the Brazilian Federal Revenue Service to register companies, public agencies, and other legal entities in Brazil. It consists of 14 characters organized into a root number, establishment order, and verification digits.

## Operations

- **Validation**: Check if the CNPJ is valid according to official rules.
- **Formatting**: Format the CNPJ as `AA.AAA.AAA/AAAA-DV`, where:
    - `A` – Alphanumeric character (digits `0` to `9` and uppercase letters `A` to `Z`).
    - `DV` – Verification digits calculated using the modulo 11 algorithm.
- **Symbol removal**: Remove the `.`, `/` and `-` characters, keeping only alphanumeric characters.
- **Generation**: Create a random valid CNPJ string.

## Validation Rules

1. Must contain exactly 14 characters after removing formatting symbols.
2. The first 12 characters may contain digits from `0` to `9` and uppercase letters from `A` to `Z`.
3. The last 2 characters correspond to the verification digits and must be numeric.
4. The verification digits must be calculated using the modulo 11 algorithm.
5. For verification digit calculation, alphanumeric characters must be converted to numeric values using the ASCII table by subtracting `48` from their corresponding decimal values.

## Algorithm

1. Remove the formatting symbols (`.`, `/` and `-`).
2. Verify that the input contains exactly 14 characters.
3. Verify that the first 12 characters are alphanumeric and the last 2 are numeric.
4. Convert alphanumeric characters to numeric values:
   - Numeric characters retain their original values.
   - Letters are converted using their ASCII decimal values minus `48`.
5. Calculate the first verification digit (DV1):
   - For the first 12 characters, assign weights from `2` to `9` from right to left, restarting at `2` after weight `9`.
   - Multiply each value by its corresponding weight and sum the results.
   - Calculate the remainder when the sum is divided by `11`.
   - If the remainder is `0` or `1`, DV1 is `0`; otherwise, it is `11 - remainder`.
6. Calculate the second verification digit (DV2):
   - For the 13 characters, append DV1 to the sequence and assign weights from `2` to `9` from right to left.
   - Multiply each value by its corresponding weight and sum the results.
   - Calculate the remainder of the sum divided by `11`.
   - If the remainder is `0` or `1`, DV2 is `0`; otherwise, it is `11 - remainder`.
7. Compare the calculated verification digits with the last two characters of the CNPJ.

## Regex

- Raw input: `^[A-Z0-9./-]{1,}$`
- Alphanumeric characters only: `^[A-Z0-9]{12}[0-9]{2}$`
- Formatted: `^[A-Z0-9]{2}\.[A-Z0-9]{3}\.[A-Z0-9]{3}/[A-Z0-9]{4}-[0-9]{2}$`

## Examples

- Valid: `03560714000142` (valid numeric CNPJ)
- Valid: `9359QAG9000184` (valid alphanumeric CNPJ)
- Invalid: `00111222000133` (invalid verification digits)
- Invalid: `12ABC34501DE3X` (verification digits must be numeric)
- Invalid: `12abc34501DE35` (lowercase letters are not allowed)
- Invalid: `12ABC34501DE3` (incorrect number of characters)
