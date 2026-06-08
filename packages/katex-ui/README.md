# katex-ui

[![npm](https://img.shields.io/npm/v/katex-ui?label=npm)](https://www.npmjs.com/package/katex-ui)
[![demo](https://img.shields.io/badge/demo-GitHub%20Pages-2f6fed)](https://laochen1994.github.io/katex-ui/)
[![TypeScript](https://img.shields.io/badge/TypeScript-ready-3178c6)](https://www.typescriptlang.org/)
[![coverage](https://img.shields.io/badge/coverage-90.37%25-7c3aed)](#quality)
[![license](https://img.shields.io/badge/license-MIT-68a063)](https://github.com/LaoChen1994/katex-ui)

Framework-free formula engine and schema toolkit for dynamic calculators.

`katex-ui` owns the durable domain layer: expression validation, LaTeX conversion, variable extraction, serializable calculator config, schema normalization, batch calculation, reusable runners, and display-safe formatting.

It is not a TeX renderer like `katex`: use it when formulas need to become calculator schemas, live forms, and persisted business rules.

## Install

```bash
pnpm add katex-ui
```

## Repository

[github.com/LaoChen1994/katex-ui](https://github.com/LaoChen1994/katex-ui)

## Homepage

[laochen1994.github.io/katex-ui/](https://laochen1994.github.io/katex-ui/)

## Highlights

- **Formula engine** - calculate arithmetic expressions with variables and functions.
- **LaTeX bridge** - convert `\frac`, `\sqrt`, powers, functions, and simple subscripts.
- **Schema generator** - turn variables into stable `FormulaSchema` fields.
- **Calculator config** - serialize source, expression, fields, and result metadata.
- **Batch formulas** - derive ordered values such as subtotal, tax, and total.
- **Renderer agnostic** - no React, Vue, or form-renderer runtime dependency.

## Quick Start

```ts
import { createLatexFormulaCalculator } from 'katex-ui/parser';

const calculator = createLatexFormulaCalculator({
  source: '\\frac{price \\times count}{discount}',
  fields: [
    { name: 'price', label: 'Price', defaultValue: 100 },
    { name: 'count', label: 'Count', defaultValue: 2 },
    { name: 'discount', label: 'Discount', defaultValue: 4 },
  ],
  result: {
    label: 'Total',
    precision: 12,
  },
});

calculator.config;
calculator.schema;
calculator.calculate({ price: 100, count: 2, discount: 4 });
// { value: 50, errors: [] }
```

## API Surface

- `katex-ui/core` - `calculateFormula`, `createFormulaRunner`, `calculateFormulaBatch`, `formatFormulaValue`.
- `katex-ui/parser` - `latexToExpression`, `parseLatexFormula`, `createLatexFormulaCalculator`.
- `katex-ui/schema` - `createFormulaSchema`, `createFormulaCalculatorConfig`, `mergeFormulaFields`.

## Quality

- Unit tests: 46 core/parser/schema tests.
- Coverage: 90.37% statements, 83.55% branches, 96% functions.
- Build: `tsup` ESM + `.d.ts`.
- Runtime dependencies: none.
