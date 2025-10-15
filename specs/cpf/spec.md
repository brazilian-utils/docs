---
id: cpf
title: "CPF"
language: pt
references:
  - lei-1234-2020
---

# CPF — Cadastro de Pessoas Físicas

## Resumo

O CPF é um identificador nacional de 11 dígitos. Esta especificação define validação, formatação,
remoção de símbolos e geração.

## Operações

- **Validação**: verificar se o CPF é válido conforme regras oficiais.
- **Formatação**: apresentar o CPF no formato padrão `XXX.XXX.XXX-YY`.
- **Remoção de símbolos**: retornar apenas os dígitos numéricos.
- **Geração**: criar um CPF válido aleatório ou seguindo regras específicas.

## Regras de validação

1. Deve ter 11 dígitos numéricos após remoção de símbolos.
2. Dígitos verificadores calculados pelo algoritmo padrão (mod 11).
3. Sequências com todos os dígitos iguais (ex.: `00000000000`) são inválidas.

## Algoritmo detalhado

1. Remover símbolos → obter 11 dígitos
2. Rejeitar se tamanho != 11 ou se é sequência repetida
3. Calcular primeiro dígito verificador (DV1):
   - Multiplicar os 9 primeiros dígitos pelos pesos 10..2
   - Somar os resultados
   - DV1 = (soma % 11 < 2 ? 0 : 11 - (soma % 11))
4. Calcular segundo dígito verificador (DV2):
   - Multiplicar os 10 primeiros dígitos (incluindo DV1) pelos pesos 11..2
   - Somar os resultados
   - DV2 = (soma % 11 < 2 ? 0 : 11 - (soma % 11))
5. Comparar DV1 e DV2 com os dígitos finais

## Regex

- Input bruto: `^[0-9\.\- ]{1,}$`
- Apenas dígitos: `^\d{11}$`
- Formato formatado: `^\d{3}\.\d{3}\.\d{3}-\d{2}$`

## Exemplos

- Válido: `11144477735` → `111.444.777-35`
- Inválido: `00000000000` (sequência repetida)
