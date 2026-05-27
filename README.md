# katex-ui

Build formula-powered forms without turning your product into a spreadsheet.

`katex-ui` turns expressions like `price * count * discount` into a stable form schema, renders that schema in React through `pdyform-react`, and calculates results as users type. The core package stays framework-free, so formula parsing, validation, schema normalization, batching, and result formatting can run anywhere.

[Documentation](https://laochen1994.github.io/katex-ui/) · [GitHub](https://github.com/LaoChen1994/katex-ui)

```tsx
import { createFormulaSchema } from 'katex-ui/schema';
import { FormulaForm } from 'katex-ui-react';

const schema = createFormulaSchema({
  expression: 'price * count * discount',
  fields: [
    { name: 'price', label: 'Price', defaultValue: 99, min: 0, step: 0.01 },
    { name: 'count', label: 'Count', defaultValue: 2, min: 1 },
    { name: 'discount', label: 'Discount', defaultValue: 0.8, min: 0, max: 1 },
  ],
  result: {
    label: 'Total',
    precision: 12,
  },
});

export const PricingForm = () => (
  <FormulaForm schema={schema} showResult />
);
```

## Why It Exists

Most dynamic-form tools stop at rendering fields. Most formula tools stop at evaluating math. Real business software needs both:

- pricing calculators
- quote builders
- tax and discount forms
- scoring models
- internal operations tools
- financial planning widgets
- any workflow where non-engineers define calculation logic

`katex-ui` gives you the missing middle layer: a domain schema that connects formulas, generated fields, UI renderers, and calculation results.

## Highlights

- **Formula to fields**: extract variables and generate form fields automatically.
- **Stable schema boundary**: expose `FormulaSchema`, not renderer internals.
- **Framework-free core**: `katex-ui` does not depend on React, Vue, or pdyform.
- **React adapter**: `katex-ui-react` converts `FormulaSchema` into `pdyform-react` schema.
- **Real-time results**: calculate on every form change.
- **Batch formulas**: derive `subtotal`, `tax`, `total`, or any ordered calculation chain.
- **Precompiled runners**: parse once, calculate many times for fast UI feedback.
- **Display-safe formatting**: turn `237.60000000000002` into `237.6`.
- **Release-ready repo**: pnpm workspace, Turbo, tsup, Vitest, Changesets, CI, release workflow, and GitHub Pages.

## Packages

| Package | Install when you need |
| --- | --- |
| `katex-ui` | Formula parsing, validation, calculation, batching, formatting, and schema utilities. |
| `katex-ui-react` | React rendering through `pdyform-react`. |

Vue support is planned as a separate adapter. It will not add Vue to the core package.

## Installation

Core only:

```bash
pnpm add katex-ui
```

React rendering:

```bash
pnpm add katex-ui katex-ui-react pdyform-core pdyform-react react react-dom
```

## Core API

```ts
import {
  calculateFormula,
  calculateFormulaBatch,
  createFormulaRunner,
  extractVariables,
  formatFormulaValue,
  getFormulaSummary,
  validateFormula,
} from 'katex-ui/core';
```

### Calculate One Formula

```ts
calculateFormula('price * count', {
  price: 10,
  count: 3,
});
// { value: 30, errors: [] }
```

### Inspect a Formula

```ts
getFormulaSummary('price * count');
// {
//   expression: 'price * count',
//   variables: ['price', 'count'],
//   valid: true,
//   errors: []
// }
```

### Precompile for Repeated Calculation

```ts
const runner = createFormulaRunner('price * count * discount');

runner.variables;
// ['price', 'count', 'discount']

runner.calculate({
  price: 99,
  count: 2,
  discount: 0.8,
});
// { value: 158.4, errors: [] }
```

### Batch Calculation

```ts
calculateFormulaBatch(
  [
    { name: 'subtotal', expression: 'price * count' },
    { name: 'tax', expression: 'subtotal * taxRate' },
    { name: 'total', expression: 'subtotal + tax' },
  ],
  {
    price: 100,
    count: 2,
    taxRate: 0.06,
  },
);
// values.subtotal === 200
// values.tax === 12
// values.total === 212
```

### Format Results

```ts
formatFormulaValue(237.60000000000002, { precision: 12 });
// '237.6'

formatFormulaValue(1234.5, {
  locale: 'en-US',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
// '1,234.50'
```

## Schema API

```ts
import {
  createFormulaSchema,
  normalizeFormulaSchema,
} from 'katex-ui/schema';
```

Create a schema from a formula:

```ts
const schema = createFormulaSchema({
  expression: 'amount * (1 + taxRate)',
  fields: [
    { name: 'amount', label: 'Amount', defaultValue: 1000, min: 0 },
    { name: 'taxRate', label: 'Tax rate', defaultValue: 0.06, min: 0, max: 1 },
  ],
  result: {
    label: 'Total',
    precision: 12,
  },
});
```

`createFormulaSchema` keeps variable order from the formula, fills missing field metadata, and ignores fields that are not used by the expression.

## React API

```tsx
import { createFormulaSchema } from 'katex-ui/schema';
import { FormulaForm } from 'katex-ui-react';

const schema = createFormulaSchema({
  expression: 'price * count * discount',
  fields: [
    { name: 'price', label: 'Price', defaultValue: 99, min: 0, step: 0.01 },
    { name: 'count', label: 'Count', defaultValue: 2, min: 1 },
    { name: 'discount', label: 'Discount', defaultValue: 0.8, min: 0, max: 1 },
  ],
  result: {
    label: 'Total',
    precision: 12,
  },
});

export const App = () => (
  <FormulaForm
    schema={schema}
    showResult
    onValuesChange={(values) => console.log(values)}
    onResult={(result) => console.log(result)}
  />
);
```

Need full control over result rendering?

```tsx
<FormulaForm
  schema={schema}
  showResult
  formatResult={(result) =>
    result.value === null ? 'No result' : `$${result.value.toFixed(2)}`
  }
/>
```

Need to inspect the renderer schema?

```tsx
<FormulaForm
  schema={schema}
  onPdyformSchema={(pdyformSchema) => {
    console.log(pdyformSchema);
  }}
/>
```

## Architecture

```txt
formula expression
        |
        v
katex-ui/core
  parse, validate, summarize, calculate, batch, format
        |
        v
katex-ui/schema
  FormulaSchema, normalization, result metadata
        |
        v
katex-ui-react
  FormulaSchema -> pdyform FormSchema
        |
        v
pdyform-react
  dynamic form rendering
```

The key rule: `FormulaSchema` belongs to `katex-ui`, not to pdyform. Renderer adapters are allowed to change; the domain schema should stay stable.

## Formula Support

The core uses `expr-eval`, so it supports arithmetic expressions, parentheses, and built-in functions such as `min`, `max`, `round`, `abs`, `floor`, and `ceil`.

Supported now:

- variable extraction
- syntax validation
- finite numeric results
- missing variable detection
- boolean values as `1` and `0`
- precompiled runners
- ordered batch calculation
- display formatting

Intentionally not supported:

- arbitrary JavaScript execution
- `eval`
- async formula execution
- remote data fetching
- visual formula authoring

## Repository Layout

```txt
apps/
  demo-react/    React demo app
  docs/          VitePress docs, deployable to GitHub Pages

packages/
  katex-ui/      Core formula and schema package
  katex-ui-react React adapter for pdyform-react
```

## Development

```bash
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Run local apps:

```bash
pnpm --filter demo-react dev
pnpm --filter docs dev
```

## Documentation Site

The docs are deployed with GitHub Pages:

```txt
https://laochen1994.github.io/katex-ui/
```

Deployment is handled by `.github/workflows/pages.yml`. The workflow builds `apps/docs` with VitePress and uploads `apps/docs/src/.vitepress/dist` as the Pages artifact. It runs on pushes to `main` and can also be started manually from GitHub Actions.

## Release Flow

This repo uses Changesets.

```bash
pnpm changeset
pnpm version
pnpm release
```

GitHub Actions are configured for CI, Changesets release, npm publish, and GitHub Pages.

## Roadmap

- Vue adapter
- richer field presets
- formula dependency graph visualization
- custom function registry
- schema import/export examples

## Status

`katex-ui` is early, but already useful for formula-driven forms, calculators, and internal tools. The API is intentionally small enough to stabilize, while the package boundary leaves room for more renderers later.
