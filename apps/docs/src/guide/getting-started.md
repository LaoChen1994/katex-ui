# 快速开始

`katex-ui` 的核心链路是：公式输入 -> 变量识别 -> schema 生成 -> 表单渲染 -> 实时计算。

它不是 TeX 排版渲染器。如果你只是想把数学公式显示成漂亮的 HTML，请使用 `katex`。如果你想把公式变成业务计算器和动态表单，使用 `katex-ui`。

安装核心包：

```bash
pnpm add katex-ui
```

创建公式 schema：

```ts
import { createFormulaSchema } from 'katex-ui/schema';

const schema = createFormulaSchema('price * count', [
  { name: 'price', label: '单价', defaultValue: 10 },
  { name: 'count', label: '数量', defaultValue: 3 },
]);
```

计算结果：

```ts
import { calculateFormula } from 'katex-ui/core';

const result = calculateFormula(schema.expression, {
  price: 10,
  count: 3,
});
```

## LaTeX 到计算器

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
    label: '总价',
    precision: 12,
  },
});

calculator.expression;
calculator.schema;
calculator.config;
calculator.calculate({ price: 100, count: 2, discount: 4 });
```

## React 渲染

```bash
pnpm add katex-ui katex-ui-react pdyform-core pdyform-react react react-dom
```

```tsx
import { createLatexFormulaCalculator } from 'katex-ui/parser';
import { FormulaForm } from 'katex-ui-react';

const calculator = createLatexFormulaCalculator({
  source: '\\frac{price \\times count}{discount}',
});

export const App = () => <FormulaForm schema={calculator.schema} showResult />;
```

## Vue 渲染

```bash
pnpm add katex-ui katex-ui-vue vue
```

```vue
<script setup lang="ts">
import { createLatexFormulaCalculator } from 'katex-ui/parser';
import { FormulaForm } from 'katex-ui-vue';

const calculator = createLatexFormulaCalculator({
  source: '\\frac{price \\times count}{discount}',
});
</script>

<template>
  <FormulaForm :schema="calculator.schema" show-result />
</template>
```
