---
id: placa-de-carro
title: "Placa de veículo"
language: pt-BR
references:
  - lei-9503-1997
---

# Placa de identificação veicular

## Resumo

Placas de identificação veicular são as chapas dianteira e traseira fixadas no veículo. Uma placa tem 7 letras e dígitos.

## Regras de validação

### Padrão Mercosul
1. A placa tem 7 letras e dígitos na sequência `LLLNLNN`.

### Padrão pré-Mercosul
1. A placa tem 7 letras e dígitos na sequência `LLLNNNN`, em dois grupos:
   - O primeiro grupo tem 3 letras (`A` a `Z`).
   - O segundo grupo tem 4 dígitos.

## Algoritmo

1. Remover os espaços no início e no fim, e os caracteres de máscara (espaço, `.`, `-` ou `/`, sozinhos ou em sequência) entre o terceiro caractere e os quatro últimos. Um caractere de máscara em outro lugar, ou qualquer outro caractere, torna a placa inválida.
2. Verificar se restam 7 caracteres.
3. Verificar se todos os caracteres são alfanuméricos.
4. Verificar se a entrada segue um dos padrões válidos:
   - Mercosul: `LLLNLNN`
   - Pré-Mercosul: `LLLNNNN`
5. Se a entrada não seguir nenhum dos padrões, a placa é inválida.

## Regex

- Entrada bruta (a máscara fica entre o terceiro caractere e os quatro últimos): `^[A-Za-z]{3}[\s.\-/]*[0-9A-Za-z]{4}$`
- Apenas caracteres (padrão pré-Mercosul ou Mercosul): `^(?:[A-Z]{3}[0-9]{4}|[A-Z]{3}[0-9][A-Z][0-9]{2})$`

## Exemplos

- Válido: `ABC1234` (padrão pré-Mercosul)
- Válido: `ABC1D23` (padrão Mercosul)
- Inválido: `AB12345` (não segue nenhum formato válido)
- Inválido: `ABCD123` (quantidade incorreta de letras)
- Inválido: `ABC123` (menos de 7 caracteres)
- Inválido: `ABC12D4` (ordem incorreta dos caracteres)
