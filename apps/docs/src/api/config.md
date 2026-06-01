# Calculator Config API

Calculator config is the serializable boundary between formula authoring and UI rendering.

## `createFormulaCalculatorConfig(options)`

Use this when the input is already a calculable expression.

```ts
import { createFormulaCalculatorConfig } from 'katex-ui/schema';

const config = createFormulaCalculatorConfig({
  expression: 'price * count',
  fields: [
    { name: 'price', label: '单价', defaultValue: 100 },
    { name: 'count', label: '数量', defaultValue: 2 },
  ],
  result: {
    label: '结果',
  },
});
```

## `createLatexFormulaCalculatorConfig(options)`

Use this when the input is LaTeX. It keeps the original `source`, stores the converted `expression`, and normalizes fields in formula variable order.

```ts
import { createLatexFormulaCalculatorConfig } from 'katex-ui/parser';

const config = createLatexFormulaCalculatorConfig({
  source: '\\frac{price \\times count}{discount}',
  fields: [
    { name: 'price', label: '单价', defaultValue: 100 },
    { name: 'count', label: '数量', defaultValue: 2 },
  ],
  result: {
    label: '结果',
  },
});
```

## `mergeFormulaFields(expression, fields?)`

Use this when a formula changes and existing field metadata should be kept only for variables still used by the formula.

```ts
import { mergeFormulaFields } from 'katex-ui/schema';

mergeFormulaFields('net + tax', [
  { name: 'tax', label: '税额', defaultValue: 12 },
  { name: 'unused', label: '旧字段' },
]);
```
