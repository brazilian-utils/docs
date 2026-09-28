---
id: cnpj
title: "CNPJ"
language: pt-BR
references:
  - in-rfb-2119-2022
  - in-rfb-2229-2024
---

# CNPJ: Cadastro Nacional da Pessoa Jurídica

## Resumo

O CNPJ é o número de identificação que a Receita Federal atribui a empresas, órgãos públicos e outras entidades no Brasil. Tem 14 caracteres: 8 da raiz, 4 da ordem do estabelecimento e 2 dígitos verificadores. Os CNPJs emitidos antes do início do formato alfanumérico usam apenas dígitos. Desde julho de 2026, novas inscrições podem conter letras maiúsculas e dígitos nos 12 primeiros caracteres. Os 2 dígitos verificadores continuam apenas numéricos.

## Regras de validação

1. A entrada deve conter exatamente 14 caracteres.
2. Os 12 primeiros caracteres podem conter dígitos de `0` a `9` e letras de `A` a `Z`. Com `version: 2`, a validação lê letras minúsculas como maiúsculas.
3. Os 2 últimos caracteres são os dígitos verificadores e devem ser numéricos.
4. Os dígitos verificadores devem vir do algoritmo do módulo 11.
5. Para calcular os dígitos verificadores, converta os 12 primeiros caracteres em valores numéricos. Use o código ASCII decimal de cada caractere e subtraia `48`.

   Exemplos:
   - `0` → `48 - 48 = 0`
   - `9` → `57 - 48 = 9`
   - `A` → `65 - 48 = 17`
   - `B` → `66 - 48 = 18`
   - `Z` → `90 - 48 = 42`

## Algoritmo

1. Verificar se a entrada tem exatamente 14 caracteres.
2. Verificar se os 12 primeiros caracteres são alfanuméricos e os 2 últimos são numéricos.
3. Converter os caracteres alfanuméricos em valores numéricos:
   - Os dígitos mantêm o seu valor.
   - As letras passam a valer o seu código ASCII decimal menos `48`.
4. Calcular o primeiro dígito verificador (DV1):
   - Para os 12 primeiros caracteres, distribuir os pesos de `2` a `9` da direita para a esquerda. Recomeçar em `2` após o peso `9`.
   - Multiplicar cada valor pelo seu peso e somar os resultados.
   - Calcular o resto da divisão da soma por `11`.
   - Se o resto for `0` ou `1`, o DV1 é `0`. Se não, o DV1 é `11 - resto`.
5. Calcular o segundo dígito verificador (DV2):
   - Adicionar o DV1 ao fim da sequência. Para esses 13 caracteres, distribuir os pesos de `2` a `9` da direita para a esquerda.
   - Multiplicar cada valor pelo seu peso e somar os resultados.
   - Calcular o resto da divisão da soma por `11`.
   - Se o resto for `0` ou `1`, o DV2 é `0`. Se não, o DV2 é `11 - resto`.
6. Comparar os dígitos verificadores calculados com os 2 últimos caracteres do CNPJ.

## Campos do número

A IN RFB nº 2.229/2024 (Anexo XV da IN RFB nº 2.119/2022) divide as 14 posições assim:

| Posições | Campo | Chave em `getCnpjInfo` |
|---|---|---|
| 1 a 8 | raiz, comum a todos os estabelecimentos da entidade | `root` |
| 9 a 12 | número de ordem do estabelecimento | `branch` |
| 13 e 14 | dígitos verificadores, sempre numéricos | `checkDigits` |

- `getCnpjInfo(value, { version })` retorna esses campos e `isInitialHeadquarters`. Retorna `null` exatamente quando `isValidCnpj(value, { version })` é `false`, então um CNPJ alfanumérico lido na versão 1 dá `null`. Os campos de um CNPJ alfanumérico vêm em maiúsculas. O resultado não tem campo `format`.
- `isInitialHeadquarters` é `true` quando a filial é `0001`. A Receita Federal dá `0001` à matriz quando a raiz é inscrita. Uma filial pode depois virar matriz sem ter a ordem `0001` (questão 25 do P&R da Receita Federal sobre o CNPJ alfanumérico), então o indicador só diz o que o número dizia na geração.
- `generateCnpj({ branch })` usa o mesmo nome. Uma filial sorteada nunca é `0000`, porque os estabelecimentos são numerados a partir de `0001`. A 2.4.0 podia retornar `0000` (cerca de uma vez a cada 10.000 CNPJs numéricos).

Exemplos:

- `getCnpjInfo("12.345.678/0001-95")` retorna `{ root: "12345678", branch: "0001", checkDigits: "95", isInitialHeadquarters: true }`.
- `getCnpjInfo("12.abc.345/01de-35", { version: 2 })` retorna `{ root: "12ABC345", branch: "01DE", checkDigits: "35", isInitialHeadquarters: false }`.
- `getCnpjInfo("12.ABC.345/01DE-35")` retorna `null` (alfanumérico, lido na versão 1).

## Máscara de ocultação e números

- `formatCnpj(value, { obfuscate: true })` oculta os 2 primeiros caracteres e os 2 dígitos verificadores (`**.345.678/0001-**`). É uma convenção da biblioteca, sem fonte oficial: nenhuma lei ou ato da Receita Federal fixa regra de mascaramento para o CNPJ, cujos dados são públicos. Ela segue a regra que as Leis de Diretrizes Orçamentárias fixam para o CPF.
- `formatCnpj` e `parseCnpj` também recebem número. Ele só é lido quando é um inteiro seguro não negativo. Número negativo, fracionário, não finito ou inseguro dá string vazia. A 2.4.0 lia os dígitos de qualquer número.

## Regex

- CNPJ sem formatação: `^[A-Z0-9]{12}[0-9]{2}$`
- CNPJ formatado: `^[A-Z0-9]{2}\.[A-Z0-9]{3}\.[A-Z0-9]{3}/[A-Z0-9]{4}-[0-9]{2}$`

## Exemplos

- Válido: `03560714000142` (CNPJ numérico válido)
- Válido: `9359QAG9000184` (CNPJ alfanumérico válido)
- `03.560.714/0001-42`: decisão pendente. A referência (JS) aceita, as outras bibliotecas não.
- Inválido: `00111222000133` (dígitos verificadores inválidos)
- Inválido: `12ABC34501DE3X` (os dígitos verificadores devem ser numéricos)
- Inválido: `12ABC34501DE3` (deve conter exatamente 14 caracteres)
- Inválido: `12ABC34501DE345` (deve conter exatamente 14 caracteres)
