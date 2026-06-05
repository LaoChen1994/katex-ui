# katex-ui

`katex-ui` 是一个公式驱动的动态表单工具集。它把普通表达式或有限 LaTeX 公式转换成可持久化的计算器 schema，再交给 React 或 Vue 渲染成实时计算表单。

它不是 `katex` 这类 TeX 排版渲染器；适合用在报价、税费、折扣、佣金、保险费率、成本模型等需要业务人员维护公式的产品场景。

线上文档地址：

```txt
https://laochen1994.github.io/katex-ui/
```

```ts
import { calculateFormula } from 'katex-ui/core';

const result = calculateFormula('price * count', {
  price: 10,
  count: 3,
});
```
