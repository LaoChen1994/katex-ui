# katex-ui

`katex-ui` 是一个公式驱动的动态表单工具集。主包只提供公式计算与稳定 schema，React 渲染能力由 `katex-ui-react` 提供。

```ts
import { calculateFormula } from 'katex-ui/core';

const result = calculateFormula('price * count', {
  price: 10,
  count: 3,
});
```
