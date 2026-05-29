# Vue Adapter Plan

Vue support should stay as a renderer adapter on top of `katex-ui`, not as logic inside the core package.

The core contract already needed by a Vue renderer is:

```ts
import { createLatexFormulaCalculator } from 'katex-ui/parser';

const calculator = createLatexFormulaCalculator({
  source: '\\frac{price \\times count}{discount}',
  fields: [
    { name: 'price', label: '单价', defaultValue: 100 },
    { name: 'count', label: '数量', defaultValue: 2 },
    { name: 'discount', label: '折扣因子', defaultValue: 4 },
  ],
  result: {
    label: '结果',
  },
});

calculator.schema;
calculator.calculate({ price: 100, count: 2, discount: 4 });
```

A future `katex-ui-vue` package should provide a small renderer around this contract:

```ts
type VueFormulaFormProps = {
  schema: FormulaSchema;
  initialValues?: FormulaValues;
  showResult?: boolean;
  onResult?: (result: FormulaCalculationResult) => void;
  onValuesChange?: (values: FormulaValues) => void;
};
```

It should not reimplement parsing, validation, result formatting, or batch calculation. Those remain in `katex-ui/core`, `katex-ui/parser`, and `katex-ui/schema`.
