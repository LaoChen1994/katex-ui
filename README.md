# katex-ui

[![npm](https://img.shields.io/npm/v/katex-ui?label=core)](https://www.npmjs.com/package/katex-ui)
[![react](https://img.shields.io/npm/v/katex-ui-react?label=react)](https://www.npmjs.com/package/katex-ui-react)
[![vue](https://img.shields.io/npm/v/katex-ui-vue?label=vue)](https://www.npmjs.com/package/katex-ui-vue)
[![demo](https://img.shields.io/badge/demo-GitHub%20Pages-2f6fed)](https://laochen1994.github.io/katex-ui/)
[![TypeScript](https://img.shields.io/badge/TypeScript-ready-3178c6)](https://www.typescriptlang.org/)
[![coverage](https://img.shields.io/badge/coverage-core%2090.37%25%20%7C%20react%2093.18%25%20%7C%20vue%2075.37%25-7c3aed)](#quality)
[![license](https://img.shields.io/badge/license-MIT-68a063)](https://github.com/LaoChen1994/katex-ui)

Formula-powered calculator toolkit for products that need user-editable calculation logic without turning the UI into a spreadsheet.

`katex-ui` converts plain expressions or pragmatic LaTeX into stable calculator config, renders that schema in React or Vue, and recalculates results as users type.

It is not a TeX renderer like `katex`: use it when formulas need to become calculator schemas, live forms, and persisted business rules.

Try the interactive demo: [laochen1994.github.io/katex-ui](https://laochen1994.github.io/katex-ui/).

## Install

```bash
pnpm add katex-ui
pnpm add katex-ui katex-ui-react pdyform-core pdyform-react react react-dom
pnpm add katex-ui katex-ui-vue vue
```

## Repository

[github.com/LaoChen1994/katex-ui](https://github.com/LaoChen1994/katex-ui)

## Homepage

[laochen1994.github.io/katex-ui/](https://laochen1994.github.io/katex-ui/)

## Highlights

- **LaTeX to calculator** - convert formulas like `\frac{price \times count}{discount}` into executable config.
- **Framework-neutral core** - parsing, validation, schema, batching, formatting, and runners live outside renderers.
- **React adapter** - render generated schemas through `katex-ui-react` and `pdyform-react`.
- **Vue adapter** - render the same schemas through `katex-ui-vue` with native Vue 3 controls.
- **Serializable config** - persist `source`, `expression`, `fields`, and `result` as JSON.
- **Batch calculations** - compute ordered chains such as subtotal, tax, and total.
- **Typed APIs** - TypeScript-first packages with ESM output and `.d.ts` files.
- **Release ready** - pnpm workspace, Turbo, tsup, Vitest, Changesets, GitHub Pages.

## Packages

| Package | Purpose | Coverage |
| --- | --- | --- |
| `katex-ui` | Core formula engine, parser, schema, config, formatting. | 90.37% |
| `katex-ui-react` | React renderer for `FormulaSchema`. | 93.18% |
| `katex-ui-vue` | Vue 3 renderer for `FormulaSchema`. | 75.37% |

## Core Usage

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

## React Usage

```tsx
import { createLatexFormulaCalculator } from 'katex-ui/parser';
import { FormulaForm } from 'katex-ui-react';

const calculator = createLatexFormulaCalculator({
  source: '\\frac{price \\times count}{discount}',
});

export const App = () => (
  <FormulaForm schema={calculator.schema} showResult />
);
```

## Vue Usage

```vue
<script setup lang="ts">
import { createLatexFormulaCalculator } from 'katex-ui/parser';
import { FormulaForm } from 'katex-ui-vue';

const calculator = createLatexFormulaCalculator({
  source: '\\frac{price \\times count}{discount}',
});
</script>

<template>
  <FormulaForm
    :schema="calculator.schema"
    show-result
  />
</template>
```

## Quality

Coverage was generated with Vitest v8 coverage on this branch:

| Package | Statements | Branches | Functions |
| --- | ---: | ---: | ---: |
| `katex-ui` | 90.37% | 83.55% | 96% |
| `katex-ui-react` | 93.18% | 53.65% | 66.66% |
| `katex-ui-vue` | 75.37% | 44.44% | 78.57% |

## Security

`katex-ui` evaluates formulas with a built-in arithmetic evaluator, not `eval`, `Function`, or a general-purpose JavaScript expression runtime. Pass only trusted formula definitions or validate user-authored formulas with `validateFormulaPolicy` before saving them.

See [SECURITY.md](./SECURITY.md) for the supported threat model and dependency notes.

## License

MIT
