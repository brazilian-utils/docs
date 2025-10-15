![Logo do Brazilian Utils](https://github.com/brazilian-utils/brand/raw/main/github-hero/github-hero.png)

<div align="center">

[Looking for the english version?](README_EN.md)

</div>

# Especificações

Este repositório contém as especificações canônicas dos utilitários
mantidos pela organização `Brazilian Utils`.

Cada utilitário descrito aqui (por exemplo, validação de CPF) tem
implementações nas bibliotecas oficiais em várias linguagens — por
exemplo JavaScript, Python e outras mantidas pela comunidade.

As specs neste repositório são a fonte de verdade: definem formatos,
regras, exemplos e casos de teste que todas as implementações em
linguagens diferentes devem seguir.

Estrutura e uso

- `specs/<util>/` — especificação do utilitário, incluindo
  `spec.md`, `spec_en.md`, `test-cases.json` e referências.
- `adapters/` — scripts auxiliares para validar, converter ou executar
  exemplos com base nas specs.

Fluxo típico

1. Consultar `specs/<util>/` para entender o comportamento esperado e
   os `test-cases.json`.
2. Implementar ou validar uma biblioteca em uma linguagem seguindo as
   regras e os casos de teste aqui definidos.
3. Propor mudanças na spec via issue e pull request; a revisão deve
   considerar compatibilidade com as implementações existentes.

## 💬 Novos Funcionalidades e Reportar Bugs

Caso queira sugerir novas funcionalidades ou reportar bugs, basta criar
uma nova [issue][github-issues]. Iremos lhe responder por lá!

Para saber mais sobre github issues, confira a
[documentação oficial do GitHub][github-issues-doc].

## 💡 Dúvidas? Ideias?

Dúvidas de como utilizar a biblioteca? Novas ideias para o projeto? Quer
compartilhar algo com a gente? Fique à vontade para criar um tópico no
nosso [Discussions][github-discussions]. Iremos interagir por lá!

Para saber mais sobre github discussions, confira a
[documentação oficial do GitHub][github-discussions-doc].

## 💻 Contribuindo com o Projeto

Sua colaboração é sempre muito bem-vinda! Para facilitar seus primeiros
passos, preparamos os seguintes arquivos:

- [CONTRIBUTING.md](/CONTRIBUTING.md): Aqui você encontrará todas as
  instruções necessárias para contribuir com o projeto.
- [CONTRIBUTING_EN.md](/CONTRIBUTING_EN.md): Versão em inglês das
  diretrizes de contribuição.
- [CODE_OF_CONDUCT.md](/CODE_OF_CONDUCT.md): Nosso código de conduta. Ele
  define as expectativas para interações respeitosas e inclusivas dentro
  da comunidade.
- [CODE_OF_CONDUCT_EN.md](/CODE_OF_CONDUCT_EN.md): Versão em inglês do
  código de conduta.
- `LICENSE` — texto da licença aplicável à documentação (Creative
  Commons Attribution 4.0 International — CC BY 4.0). Essa licença
  permite reutilização e adaptação dos conteúdos desde que haja
  atribuição.
- `LICENSE-CODE` — licença aplicável a trechos de código e snippets
  (MIT). Use essa licença para código incorporado na documentação.

Certifique-se de ler esses arquivos com atenção antes de contribuir. Se
tiver qualquer dificuldade ou dúvida, não hesite em nos perguntar via
[GitHub Discussions][github-discussions]. Toda ajuda conta!

## ❤️ Quem já Contribuiu

<a href="https://github.com/brazilian-utils/docs/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=brazilian-utils/docs" />
</a></br></br>

_Made with [contrib.rocks](https://contrib.rocks)._

[github-discussions-doc]: https://docs.github.com/pt/discussions
[github-discussions]: https://github.com/brazilian-utils/docs/discussions
[github-issues-doc]: https://docs.github.com/pt/issues/tracking-your-work-with-issues/creating-an-issue
[github-issues]: https://github.com/brazilian-utils/docs/issues
