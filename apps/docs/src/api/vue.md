# Vue API

`katex-ui-vue` renders `FormulaSchema` with native Vue 3 controls.

It does not reimplement parsing, validation, result formatting, or calculation. Those stay in `katex-ui/core`, `katex-ui/parser`, and `katex-ui/schema`.

## Install

```bash
pnpm add katex-ui katex-ui-vue vue
```

## `FormulaForm`

```vue
<script setup lang="ts">
import { createLatexFormulaCalculator } from 'katex-ui/parser';
import { FormulaForm } from 'katex-ui-vue';

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
</script>

<template>
  <FormulaForm
    :schema="calculator.schema"
    show-result
    @result="(result) => console.log(result)"
    @values-change="(values) => console.log(values)"
  />
</template>
```

## Props

```ts
type FormulaFormProps = {
  schema: FormulaSchema;
  className?: string;
  formatResult?: (result: FormulaCalculationResult) => number | string;
  initialValues?: FormulaValues;
  resultClassName?: string;
  resultLabel?: string;
  showResult?: boolean;
};
```

## Emits

- `change(values)`
- `valuesChange(values)`
- `result(result)`
