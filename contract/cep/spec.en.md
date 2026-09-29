---
id: cep
title: "CEP"
language: en-US
references:
  - law 6.538/1978
---

# CEP: Brazilian Postal Code

## Summary

The CEP is a numeric code of eight digits. The postal service assigns these codes to localities, streets, postal units, services, public agencies, companies and buildings. The codes guide and speed up the routing, processing and delivery of mail items.

## Validation rules

1. The input must contain exactly `8` digits.

## Algorithm

1. Check that the input contains exactly `8` characters.
2. Check that all characters are digits.
3. If both conditions are true, return valid. If not, return invalid.

## Regex

- Unformatted CEP: `^\d{8}$`
- Formatted CEP: `^\d{5}-\d{3}$`

## State ranges

The Correios assign each state one or more blocks of CEPs. `cep.getState` reads the state from these blocks, offline.

- A block belongs to a state, but not every CEP inside it is in use. `10000-000` falls in the SP block although no city uses `10xxx`.
- Two blocks belong to no state: `00000-000` to `00999-999` and `78900-000` to `78999-999`. MT ends at `78899-999`.
- AM, DF and GO have two blocks each. `72800-000` to `72999-999`, between the two DF blocks, belongs to GO.
- The full table is in the description of `cep.getState`.
- `cep.generate` draws only inside these blocks, so the CEP it generates always belongs to a state.

## Examples

- Valid: `01310200`
- `01310-200`: pending decision. The reference (JS) accepts it, the other libraries do not.
- Invalid: `12345` (must contain exactly `8` characters)
- Invalid: `123456789` (must contain exactly `8` characters)
- Invalid: `abcdefgh` (must contain only digits)
