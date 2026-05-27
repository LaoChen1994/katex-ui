# katex-ui-react

React renderer for `katex-ui` formula schemas, powered by `pdyform-react`.

Use this package when you want to turn a formula into a live React form with real-time calculation results.

```bash
pnpm add katex-ui katex-ui-react pdyform-core pdyform-react react react-dom
```

## Quick Start

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

export const App = () => <FormulaForm schema={schema} showResult />;
```

## Listen to Values and Results

```tsx
<FormulaForm
  schema={schema}
  onValuesChange={(values) => {
    console.log(values);
  }}
  onResult={(result) => {
    console.log(result.value, result.errors);
  }}
/>
```

`onChange` is still supported as an alias for value changes.

## Custom Result Rendering

```tsx
<FormulaForm
  schema={schema}
  showResult
  resultClassName="result"
  formatResult={(result) =>
    result.value === null ? 'No result' : `$${result.value.toFixed(2)}`
  }
/>
```

## Inspect pdyform Schema

```tsx
<FormulaForm
  schema={schema}
  onPdyformSchema={(pdyformSchema) => {
    console.log(pdyformSchema);
  }}
/>
```

## Custom Field Components

`katex-ui-react` forwards `componentMap` to `pdyform-react`.

```tsx
<FormulaForm
  schema={schema}
  componentMap={{
    text: MyTextField,
  }}
/>
```

## Package Boundary

`katex-ui-react` depends on `katex-ui`, but React and pdyform are peer dependencies. That keeps `katex-ui` clean for non-React users while letting React apps opt into the renderer they need.
