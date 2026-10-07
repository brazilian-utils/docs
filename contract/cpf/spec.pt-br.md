---
id: cpf
title: "CPF"
language: pt-BR
references:
  - IN RFB nº 2.172/2024
  - lei 14.534/2023
  - Receita Federal, folheto "Cadastros: CPF e CNPJ"
  - Manual de Preenchimento da e-Financeira (REGRA_VALIDA_CPF)
---

# CPF: Cadastro de Pessoas Físicas

## Resumo

O CPF é um identificador nacional de 11 dígitos. Os 8 primeiros dígitos são o número de inscrição, escolhido ao acaso. O nono dígito indica a Região Fiscal responsável pela inscrição. Os 2 últimos dígitos são dígitos verificadores. Desde janeiro de 2023, o Brasil usa o CPF como número único de identificação.

## Regras de validação

1. A entrada deve conter exatamente 11 caracteres.
2. Os dígitos verificadores vêm do algoritmo padrão (mod 11).
3. Sequências com todos os dígitos iguais (por exemplo, `00000000000`) são inválidas.

## Algoritmo

1. Rejeitar a entrada se o tamanho != 11 ou se for uma sequência repetida.
2. Calcular o primeiro dígito verificador (DV1):
   - Multiplicar os 9 primeiros dígitos pelos pesos 10..2.
   - Somar os resultados.
   - DV1 = (soma % 11 < 2 ? 0 : 11 - (soma % 11))
3. Calcular o segundo dígito verificador (DV2):
   - Multiplicar os 10 primeiros dígitos (incluindo DV1) pelos pesos 11..2.
   - Somar os resultados.
   - DV2 = (soma % 11 < 2 ? 0 : 11 - (soma % 11))
4. Comparar DV1 e DV2 com os 2 últimos dígitos.

## Fontes das regras

- A norma do CPF, IN RFB nº 2.172/2024, não define os dígitos verificadores.
- A regra do dígito verificador (REGRA_VALIDA_CPF) e o exemplo `280.012.389-38` vêm do Manual de Preenchimento da e-Financeira da Receita Federal, aprovado pelo Ato Declaratório Executivo Cofis nº 10/2026.
- Os números reservados (os 11 dígitos iguais, de `000.000.000-00` a `999.999.999-99`) vêm do leiaute DJE da Receita Federal, que os lista como inválidos.
- A forma oculta do `formatCpf` (`***.456.789-**`) segue a regra que as Leis de Diretrizes Orçamentárias fixam para publicar um CPF: Lei nº 14.194/2021, art. 149, repetida pela Lei nº 15.321/2025 (LDO 2026), art. 163.

## Região fiscal (9º dígito)

O 9º dígito é a Região Fiscal da Receita Federal do endereço informado no primeiro cadastro do CPF. `1` a `9` são a 1ª a 9ª regiões, e `0` é a 10ª.

| Dígito | Estados |
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

- O dígito não é o local de nascimento nem de residência. É a região do endereço no primeiro cadastro.
- Numa região com vários estados, o número não diz qual deles.
- `getCpfInfo` retorna `{ base, fiscalRegion, states, checkDigits }`: os 8 primeiros dígitos, o 9º dígito como string, os estados da região ordenados pelo nome, e os 2 dígitos verificadores. Retorna `null` exatamente quando `isValidCpf` é `false`.
- `generateCpf(state)` escreve o dígito da região de `state`. O código do estado é lido sem distinção de caixa e sem espaços nas pontas (`"sp"` é `SP`). A 2.4.0 só lia o código em maiúsculas.

Exemplo: `getCpfInfo("123.456.789-09")` retorna `{ base: "12345678", fiscalRegion: "9", states: ["PR", "SC"], checkDigits: "09" }`.

## Números como entrada

`formatCpf` e `parseCpf` também recebem número. Ele só é lido se for um inteiro seguro não negativo. Número negativo, fracionário, não finito ou inseguro retorna uma string vazia. A 2.4.0 lia os dígitos de qualquer número.

## Regex

- CPF sem formatação: `^\d{11}$`
- CPF formatado: `^\d{3}\.\d{3}\.\d{3}-\d{2}$`

## Exemplos

- Válido: `11144477735`
- `111.444.777-35`: decisão pendente. A referência (JS) aceita, as outras bibliotecas não.
- Inválido: `00000000000` (sequência repetida)
- Inválido: `1114447773` (deve conter exatamente 11 caracteres)
- Inválido: `111444777355` (deve conter exatamente 11 caracteres)
