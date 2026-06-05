# Security

## Threat Model

`katex-ui` is designed for product-owned calculator formulas, admin-authored business rules, and persisted calculator schemas. It is not designed to execute arbitrary untrusted JavaScript.

The core package evaluates expressions with `expr-eval`, not `eval` or `Function`. `createFormulaRunner` only forwards number, string, and boolean values into the evaluator.

## User-Authored Formulas

If end users can write formulas, validate and review those formulas before saving them. Keep formula permissions separate from ordinary form submission permissions.

Recommended controls:

- Store the original `source`, generated `expression`, normalized `fields`, and result metadata.
- Review parser errors before publishing a formula.
- Restrict who can create or update formulas in production systems.
- Treat dependency audit findings in expression parsers as release blockers.

## Dependency Note

`expr-eval` is currently the only runtime dependency of `katex-ui`. The latest npm version checked for this change is `2.0.2`, which is the version already used by this workspace.
