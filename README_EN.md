![Brazilian Utils Logo](https://github.com/brazilian-utils/brand/raw/main/github-hero/github-hero.png)

<div align="center">

[Procurando pela versão em português?](README.md)

</div>

## Specifications

This repository contains the canonical specifications for the
utilities maintained by the **Brazilian Utils** organization.

Each utility documented here (for example, CPF validation) has
implementations in the official libraries across several languages —
for example JavaScript, Python and others maintained by the
community.

The specs in this repository are the source of truth: they define
formats, rules, examples and test cases that all implementations in
different languages should follow.

Structure and usage

- `specs/<util>/` — utility specification, including `spec.md`,
  `spec_en.md`, `test-cases.json` and references.
- `adapters/` — helper scripts to validate, convert or run examples
  based on the specs.

Typical workflow

1. Check `specs/<util>/` to understand the expected behavior and the
   `test-cases.json`.
2. Implement or validate a library in a language following the rules
   and test cases defined here.
3. Propose changes to the spec via issue and pull request; reviews
   should consider compatibility with existing implementations.

## 💬 Feature Requests and Bug Reports

If you want to suggest new features or report bugs, simply create a
new [issue][github-issues]. We will respond there!

To learn more about GitHub issues, check the
[official GitHub documentation][github-issues-doc].

## 💡 Questions? Ideas?

Questions on how to use the library? New ideas for the project? Want
to share something with us? Feel free to start a thread in our
[Discussions][github-discussions]. We will interact there!

To learn more about GitHub discussions, check the
[official GitHub documentation][github-discussions-doc].

## 💻 Contributing to the Project

Your contribution is always welcome! To make your first steps easier,
we prepared the following files:

- [CONTRIBUTING.md](/CONTRIBUTING.md): Here you will find all the
  instructions necessary to contribute to the project.
- [CONTRIBUTING_EN.md](/CONTRIBUTING_EN.md): English version of the
  contribution guidelines.
- [CODE_OF_CONDUCT.md](/CODE_OF_CONDUCT.md): Our code of conduct. It
  defines expectations for respectful and inclusive interactions
  within the community.
- [CODE_OF_CONDUCT_EN.md](/CODE_OF_CONDUCT_EN.md): English version of
  the code of conduct.
- `LICENSE` — license text applicable to the documentation (Creative
  Commons Attribution 4.0 International — CC BY 4.0). This license
  allows reuse and adaptation of content as long as attribution is
  provided.
- `LICENSE-CODE` — license applicable to code snippets and examples
  (MIT). Use this license for code included in the documentation.

Be sure to read these files carefully before contributing. If you
have any difficulty or questions, do not hesitate to ask us via
[GitHub Discussions][github-discussions]. Every help counts!

## ❤️ Contributors

<a href="https://github.com/brazilian-utils/docs/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=brazilian-utils/docs" />
</a></br></br>

_Made with [contrib.rocks](https://contrib.rocks)._

[contributing]: CONTRIBUTING_EN.md
[github-discussions-doc]: https://docs.github.com/en/discussions
[github-discussions]: https://github.com/brazilian-utils/docs/discussions
[github-issues-doc]: https://docs.github.com/en/issues/tracking-your-work-with-issues/creating-an-issue
[github-issues]: https://github.com/brazilian-utils/docs/issues
