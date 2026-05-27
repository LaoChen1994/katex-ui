# katex-ui

Framework-free formula and schema utilities for formula-driven forms.

Install this package when you want formula parsing, validation, calculation, result formatting, schema generation, or batch calculation without installing React, Vue, or any form renderer.

[Documentation](https://laochen1994.github.io/katex-ui/) · [GitHub](https://github.com/LaoChen1994/katex-ui)

```bash
pnpm add katex-ui
```

## What You Get

- `katex-ui/core`: formula utilities
- `katex-ui/parser`: LaTeX subset to expression conversion
- `katex-ui/schema`: stable form schema utilities
- no React dependency
- no Vue dependency
- no pdyform dependency

## Formula Calculation

```ts
import { calculateFormula } from 'katex-ui/core';

calculateFormula('price * count', {
  price: 10,
  count: 3,
});
// { value: 30, errors: [] }
```

## Precompiled Runner

```ts
import { createFormulaRunner } from 'katex-ui/core';

const runner = createFormulaRunner('price * count * discount');

runner.variables;
// ['price', 'count', 'discount']

runner.calculate({
  price: 99,
  count: 2,
  discount: 0.8,
});
```

## Batch Calculation

```ts
import { calculateFormulaBatch } from 'katex-ui/core';

const result = calculateFormulaBatch(
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

result.values.total;
// 212
```

## Schema Generation

```ts
import { createFormulaSchema } from 'katex-ui/schema';

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

## LaTeX Parser

```ts
import { calculateLatexFormula, latexToExpression } from 'katex-ui/parser';

latexToExpression('\\frac{price \\times count}{discount}');
// '((price * count) / (discount))'

calculateLatexFormula('\\frac{price \\times count}{discount}', {
  price: 100,
  count: 2,
  discount: 4,
});
// { value: 50, errors: [] }
```

The parser is a focused conversion layer for common calculation formulas. It is not a full LaTeX engine.

## Result Formatting

```ts
import { formatFormulaValue } from 'katex-ui/core';

formatFormulaValue(237.60000000000002, { precision: 12 });
// '237.6'
```

## Use With React

Install `katex-ui-react` if you want to render `FormulaSchema` with React and pdyform.

```bash
pnpm add katex-ui-react pdyform-core pdyform-react react react-dom
```
