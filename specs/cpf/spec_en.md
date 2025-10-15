---
id: cpf
title: "CPF"
language: en
references:
  - lei-1234-2020
---

# CPF — Brazilian Individual Taxpayer Registry

## Summary

The CPF is a national identifier consisting of 11 digits. This specification defines validation,
formatting, symbol removal, and generation.

## Operations

- **Validation**: check if the CPF is valid according to official rules.
- **Formatting**: present the CPF in the standard format `XXX.XXX.XXX-YY`.
- **Symbol removal**: return only numeric digits.
- **Generation**: create a valid CPF randomly or following specific rules.

## Validation Rules

1. Must have 11 numeric digits after symbol removal.
2. Check digits are calculated using the standard mod-11 algorithm.
3. Sequences with all digits equal (e.g., `00000000000`) are invalid.

## Algorithm

1. Remove symbols → get 11 digits
2. Reject if length != 11 or if repeated sequence
3. Calculate first check digit (DV1):
   - Multiply the first 9 digits by weights 10..2
   - Sum results
   - DV1 = (sum % 11 < 2 ? 0 : 11 - (sum % 11))
4. Calculate second check digit (DV2):
   - Multiply the first 10 digits (including DV1) by weights 11..2
   - Sum results
   - DV2 = (sum % 11 < 2 ? 0 : 11 - (sum % 11))
5. Compare DV1 and DV2 with last two digits

## Regex

- Raw input: `^[0-9\.\- ]{1,}$`
- Only digits: `^\d{11}$`
- Formatted: `^\d{3}\.\d{3}\.\d{3}-\d{2}$`

## Examples

- Valid: `11144477735` → `111.444.777-35`
- Invalid: `00000000000` (repeated sequence)
