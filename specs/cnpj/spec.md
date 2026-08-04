---
id: cnpj
title: "CNPJ"
language: pt-BR
references:
  - IN RFB nº 2119/2022
  - IN RFB nº 2229/2024
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
- **Geração**: Cria uma string de CNPJ válida aleatória.

## Regras de validação

1. Deve conter exatamente 14 caracteres após remoção dos símbolos.
2. Os 12 primeiros caracteres podem conter algarismos de 0 a 9 e letras maiúsculas de A a Z.
3. Os 2 últimos caracteres correspondem aos dígitos verificadores e devem ser numéricos.
4. Os dígitos verificadores devem ser calculados pelo algoritmo padrão (módulo 11).
5. Para o cálculo dos dígitos verificadores, os caracteres alfanuméricos devem ser convertidos em valores numéricos utilizando a tabela ASCII, subtraindo 48 do valor decimal correspondente.

## Algoritmo detalhado

1. Remover os símbolos de formatação (`.`, `/` e `-`).
2. Verificar se a entrada possui exatamente 14 caracteres.
3. Verificar se os 12 primeiros caracteres são alfanuméricos e os 2 últimos são numéricos.
4. Converter os caracteres alfanuméricos em valores numéricos:
   - Caracteres numéricos mantêm seu valor.
   - Letras são convertidas utilizando o valor ASCII subtraído de 48.
5. Calcular o primeiro dígito verificador (DV1):
   - Aplicar os pesos definidos aos 12 primeiros valores.
   - Somar os resultados.
   - Calcular o resto da divisão por 11.
   - Calcular o dígito verificador subtraindo o resto de 11.
6. Calcular o segundo dígito verificador (DV2):
   - Adicionar o DV1 à sequência de caracteres.
   - Aplicar os pesos correspondentes.
   - Somar os resultados.
   - Calcular o resto da divisão por 11.
   - Calcular o dígito verificador subtraindo o resto de 11.
7. Comparar os dígitos verificadores calculados com os dois últimos caracteres do CNPJ.

## Regex

- Input bruto: `^[A-Z0-9./-]{1,}$`
- Apenas caracteres alfanuméricos: `^[A-Z0-9]{12}[0-9]{2}$`
- Formato formatado: `^[A-Z0-9]{2}\.[A-Z0-9]{3}\.[A-Z0-9]{3}/[A-Z0-9]{4}-[0-9]{2}$`

## Exemplos

- Válido: `03560714000142` (CNPJ numérico válido)
- Válido: `9359QAG9000184` (CNPJ alfanumérico válido)
- Válido: `93.59Q.AG9/0001-84` (CNPJ alfanumérico formatado)
- Inválido: `00111222000133` (dígitos verificadores inválidos)
- Inválido: `12ABC34501DE3X` (dígitos verificadores devem ser numéricos)
- Inválido: `12abc34501DE35` (letras minúsculas não são permitidas)