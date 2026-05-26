# 快速开始

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
