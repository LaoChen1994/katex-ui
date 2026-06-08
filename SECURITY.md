# Security

## Threat Model

`katex-ui` is designed for product-owned calculator formulas, admin-authored business rules, and persisted calculator schemas. It is not designed to execute arbitrary untrusted JavaScript.

The core package evaluates expressions with a built-in arithmetic evaluator, not `eval`, `Function`, or a general-purpose JavaScript expression runtime.

Supported expression features are intentionally limited to:

- numbers, variables, parentheses, unary `+` and `-`
- `+`, `-`, `*`, `/`, `%`, and `^`
- built-in functions: `abs`, `ceil`, `cos`, `exp`, `floor`, `log`, `max`, `min`, `round`, `sin`, `sqrt`, and `tan`

## User-Authored Formulas

If end users can write formulas, validate and review those formulas before saving them. Keep formula permissions separate from ordinary form submission permissions.

Recommended controls:

- Store the original `source`, generated `expression`, normalized `fields`, and result metadata.
- Review parser errors before publishing a formula.
- Use `validateFormulaPolicy` to enforce allowed functions, allowed variables, and maximum expression length.
- Restrict who can create or update formulas in production systems.
- Treat dependency audit findings in expression parsers as release blockers.

## Dependency Note

`katex-ui` does not depend on a third-party expression evaluator at runtime.
