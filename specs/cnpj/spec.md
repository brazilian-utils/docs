---
id: cnpj
title: "CNPJ"
language: pt-BR
references:
  - in-rfb-2119-2022
  - in-rfb-2229-2024
---

# CNPJ — Cadastro Nacional da Pessoa Jurídica

## Resumo

O CNPJ é um número de identificação único emitido pela Receita Federal para registrar empresas, órgãos públicos e outras entidades no Brasil. Ele é composto por 14 caracteres organizados em raiz, ordem de estabelecimento e dígitos verificadores.

## Operações

- **Validação**: Verificar se o CNPJ é válido conforme regras oficiais.
- **Formatação**: Apresentar o CNPJ no formato `AA.AAA.AAA/AAAA-DV`, onde:
    - `A` – Caractere alfanumérico (algarismos de 0 a 9 e letras maiúsculas de A a Z).
    - `DV` – Dígitos verificadores calculados pelo algoritmo do módulo 11.
- **Remoção de símbolos**: Remover os caracteres `.`, `/` e `-`, mantendo apenas os caracteres alfanuméricos.
- **Geração**: Criar uma string de CNPJ válida aleatória.

## Regras de validação

1. Deve conter exatamente 14 caracteres após remoção dos símbolos.
2. Os 12 primeiros caracteres podem conter algarismos de 0 a 9 e letras maiúsculas de A a Z.
3. Os 2 últimos caracteres correspondem aos dígitos verificadores e devem ser numéricos.
4. Os dígitos verificadores devem ser calculados pelo algoritmo do módulo 11.
5. Para o cálculo dos dígitos verificadores, os caracteres alfanuméricos devem ser convertidos em valores numéricos utilizando a tabela ASCII, subtraindo 48 do valor decimal correspondente.

## Algoritmo detalhado

1. Remover os símbolos de formatação (`.`, `/` e `-`).
2. Verificar se a entrada possui exatamente 14 caracteres.
3. Verificar se os 12 primeiros caracteres são alfanuméricos e os 2 últimos são numéricos.
4. Converter os caracteres alfanuméricos em valores numéricos:
   - Caracteres numéricos mantêm seu valor.
   - Letras são convertidas utilizando o valor ASCII decimal subtraído de `48`.
5. Calcular o primeiro dígito verificador (DV1):
   - Para os 12 primeiros caracteres, distribuir os pesos de `2` a `9` da direita para a esquerda, reiniciando em `2` após o peso `9`. 
   - Multiplicar cada valor pelo peso correspondente e somar os resultados.
   - Calcular o resto da divisão da soma por `11`.
   - Se o resto for `0` ou `1`, o DV1 será `0`; caso contrário, será `11 - resto`.
6. Calcular o segundo dígito verificador (DV2):
   - Para os 13 caracteres, adicionar o DV1 à sequência e distribuir novamente os pesos de `2` a `9` da direita para a esquerda.
   - Multiplicar cada valor pelo peso correspondente e somar os resultados.
   - Calcular o resto da divisão da soma por `11`.
   - Se o resto for `0` ou `1`, o DV2 será `0`; caso contrário, será `11 - resto`.
7. Comparar os dígitos verificadores calculados com os dois últimos caracteres do CNPJ.

## Regex

- Input bruto: `^[A-Z0-9./-]{1,}$`
- Apenas caracteres alfanuméricos: `^[A-Z0-9]{12}[0-9]{2}$`
- Formato formatado: `^[A-Z0-9]{2}\.[A-Z0-9]{3}\.[A-Z0-9]{3}/[A-Z0-9]{4}-[0-9]{2}$`

## Exemplos

- Válido: `03560714000142` (CNPJ numérico válido)
- Válido: `9359QAG9000184` (CNPJ alfanumérico válido)
- Inválido: `00111222000133` (dígitos verificadores inválidos)
- Inválido: `12ABC34501DE3X` (os dígitos verificadores devem ser numéricos)
- Inválido: `12abc34501DE35` (letras minúsculas não são permitidas)
- Inválido: `12ABC34501DE3` (quantidade incorreta de caracteres)
