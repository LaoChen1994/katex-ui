# katex-ui-react

[![npm](https://img.shields.io/npm/v/katex-ui-react?label=npm)](https://www.npmjs.com/package/katex-ui-react)
[![demo](https://img.shields.io/badge/demo-GitHub%20Pages-2f6fed)](https://laochen1994.github.io/katex-ui/)
[![React](https://img.shields.io/badge/React-18%20%7C%2019-61dafb)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-ready-3178c6)](https://www.typescriptlang.org/)
[![coverage](https://img.shields.io/badge/coverage-93.18%25-7c3aed)](#quality)
[![license](https://img.shields.io/badge/license-MIT-68a063)](https://github.com/LaoChen1994/katex-ui)

React renderer for formula-powered calculators built with `katex-ui`, powered by `pdyform-react`.

Use it when you want to turn a generated `FormulaSchema` into a production React form with live calculation output, typed callbacks, custom fields, and a stable schema boundary.

## Install

```bash
pnpm add katex-ui katex-ui-react pdyform-core pdyform-react react react-dom
```

## Repository

[github.com/LaoChen1994/katex-ui](https://github.com/LaoChen1994/katex-ui)

## Homepage

[laochen1994.github.io/katex-ui/](https://laochen1994.github.io/katex-ui/)

## Highlights

- **React adapter** - renders `FormulaSchema` through `pdyform-react`.
- **Live calculation** - emits values and results as users type.
- **Custom field system** - forwards `componentMap` into pdyform.
- **Custom result rendering** - format the result bar with product-specific UI.
- **Inspectable schema** - expose the generated pdyform schema through `onPdyformSchema`.
- **Framework boundary kept clean** - React stays out of `katex-ui` core.

## Quick Start

```tsx
import { createLatexFormulaCalculator } from 'katex-ui/parser';
import { FormulaForm } from 'katex-ui-react';

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

export const App = () => (
  <FormulaForm
    schema={calculator.schema}
    showResult
    onValuesChange={(values) => console.log(values)}
    onResult={(result) => console.log(result)}
  />
);
```

## Custom Result Rendering

```tsx
<FormulaForm
  schema={calculator.schema}
  showResult
  resultClassName="result"
  formatResult={(result) =>
    result.value === null ? 'No result' : `$${result.value.toFixed(2)}`
  }
/>
```

## Quality

- Unit tests: schema adapter and React DOM behavior tests.
- Coverage: 93.18% statements, 53.65% branches, 66.66% functions.
- Build: `tsup` ESM + `.d.ts`.
- Runtime peers: `react`, `react-dom`, `pdyform-core`, `pdyform-react`.
