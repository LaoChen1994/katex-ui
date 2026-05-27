# 批量公式

批量公式适合 `subtotal -> tax -> total` 这种有顺序依赖的场景。

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

console.log(result.values.total);
// 212
```

每个公式的结果会写入 `values`，后续公式可以直接引用前面公式的名称。
