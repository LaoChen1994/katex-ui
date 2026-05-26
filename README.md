# katex-ui

Formula-driven dynamic forms for modern frontends.

`katex-ui` lets you turn a calculation formula into a typed form schema, render it with your UI framework, and calculate the result in real time. The core package is framework-free. React support ships as a separate adapter so users only install the UI runtime they actually need.

```tsx
import { createFormulaSchema } from 'katex-ui/schema';
import { FormulaForm } from 'katex-ui-react';

const schema = createFormulaSchema('price * count * discount', [
  { name: 'price', label: 'Price', defaultValue: 99 },
  { name: 'count', label: 'Count', defaultValue: 2 },
  { name: 'discount', label: 'Discount', defaultValue: 0.8 },
]);

export const App = () => (
  <FormulaForm
    schema={schema}
    onResult={(result) => {
      console.log(result.value);
    }}
  />
);
```

## Why katex-ui

- **Formula in, form out**: write `price * count`, get the fields required to collect `price` and `count`.
- **UI-independent core**: `katex-ui` has no React, Vue, or pdyform dependency.
- **Stable domain schema**: expose your business schema first, then adapt it to renderers.
- **React adapter included**: `katex-ui-react` converts `FormulaSchema` to `pdyform-react`.
- **Real-time calculation**: form state changes produce calculation results immediately.
- **Monorepo ready**: pnpm workspace, Turbo, tsup, Vitest, Changesets, CI, release workflow, and GitHub Pages are already wired.

## Packages

| Package | Purpose |
| --- | --- |
| `katex-ui` | Core formula parsing, validation, calculation, and schema utilities. |
| `katex-ui-react` | React adapter backed by `pdyform-react`. |

Vue support is intentionally deferred. The package boundary is already prepared for a future `katex-ui-vue` adapter without adding Vue to the core package.

## Installation

Core only:

```bash
pnpm add katex-ui
```

React rendering:

```bash
pnpm add katex-ui katex-ui-react pdyform-core pdyform-react react react-dom
```

## Core Usage

Use `katex-ui/core` when you only need formula behavior.

```ts
import {
  calculateFormula,
  extractVariables,
  validateFormula,
} from 'katex-ui/core';

extractVariables('price * count');
// ['price', 'count']

validateFormula('price * count');
// { valid: true, errors: [] }

calculateFormula('price * count', {
  price: 10,
  count: 3,
});
// { value: 30, errors: [] }
```

Invalid input returns structured errors instead of throwing:

```ts
calculateFormula('price * count', { price: 10 });
// {
//   value: null,
//   errors: [
//     {
//       code: 'MISSING_VARIABLE',
//       message: 'Variable "count" is required.',
//       variable: 'count'
//     }
//   ]
// }
```

## Schema Usage

Use `katex-ui/schema` to create a stable katex-ui schema from a formula.

```ts
import { createFormulaSchema } from 'katex-ui/schema';

const schema = createFormulaSchema('amount * (1 + taxRate)', [
  { name: 'amount', label: 'Amount', defaultValue: 1000 },
  { name: 'taxRate', label: 'Tax rate', defaultValue: 0.06 },
]);
```

Generated schema:

```ts
{
  expression: 'amount * (1 + taxRate)',
  fields: [
    {
      name: 'amount',
      label: 'Amount',
      valueType: 'number',
      required: true,
      defaultValue: 1000,
    },
    {
      name: 'taxRate',
      label: 'Tax rate',
      valueType: 'number',
      required: true,
      defaultValue: 0.06,
    },
  ],
}
```

## React Usage

`katex-ui-react` renders the schema through `pdyform-react` and reports calculation results.

```tsx
import { useMemo, useState } from 'react';
import { createFormulaSchema } from 'katex-ui/schema';
import { FormulaForm } from 'katex-ui-react';

export const PricingForm = () => {
  const [result, setResult] = useState<number | null>(null);

  const schema = useMemo(
    () =>
      createFormulaSchema('price * count * discount', [
        { name: 'price', label: 'Price', defaultValue: 99 },
        { name: 'count', label: 'Count', defaultValue: 2 },
        { name: 'discount', label: 'Discount', defaultValue: 0.8 },
      ]),
    [],
  );

  return (
    <>
      <FormulaForm
        schema={schema}
        initialValues={{
          price: 99,
          count: 2,
          discount: 0.8,
        }}
        onResult={(nextResult) => setResult(nextResult.value)}
      />

      <strong>{result ?? '-'}</strong>
    </>
  );
};
```

## Architecture

```txt
formula expression
        |
        v
katex-ui/core
  parse, validate, extract variables, calculate
        |
        v
katex-ui/schema
  FormulaSchema
        |
        v
katex-ui-react
  FormulaSchema -> pdyform FormSchema
        |
        v
pdyform-react
  dynamic form rendering
```

The important boundary is that `FormulaSchema` belongs to `katex-ui`, not to pdyform. That keeps the public API stable even if the underlying renderer changes later.

## Formula Support

The first release is intentionally focused:

- arithmetic expressions
- parentheses
- built-in functions supported by `expr-eval`, such as `min`, `max`, `round`, `abs`
- finite numeric results
- missing variable detection
- boolean values converted to `1` and `0` during calculation

Not included in the first release:

- arbitrary JavaScript evaluation
- async formula execution
- cross-form dependency graphs
- visual formula builders

## Development

```bash
pnpm install
pnpm dev
pnpm test
pnpm build
```

Useful commands:

```bash
pnpm lint
pnpm typecheck
pnpm changeset
pnpm --filter demo-react dev
pnpm --filter docs dev
```

## Repository Layout

```txt
apps/
  demo-react/    React demo app
  docs/          VitePress docs, deployable to GitHub Pages

packages/
  katex-ui/      Core formula and schema package
  katex-ui-react React adapter for pdyform-react
```

## Release Flow

This repo uses Changesets.

```bash
pnpm changeset
pnpm version
pnpm release
```

GitHub Actions are configured for:

- PR and main branch verification
- Changesets release PR and publish flow
- GitHub Pages deployment for docs

## Status

This project is in MVP stage. The core API is deliberately small so the formula-to-form contract can stabilize before adding Vue support and more advanced form orchestration.
