# Parser API

`katex-ui/parser` 提供一个 LaTeX 子集到计算表达式的转换层。

它不是完整 LaTeX 引擎，也不是 KaTeX 计算器。它的职责是把常见公式输入转换成 `katex-ui/core` 可以计算的表达式。

## `latexToExpression(source)`

```ts
latexToExpression('\\frac{price \\times count}{discount}');
// '((price * count) / (discount))'
```

支持的第一批语法：

| LaTeX | 输出表达式 |
| --- | --- |
| `a \times b` | `a * b` |
| `a \cdot b` | `a * b` |
| `a \div b` | `a / b` |
| `\frac{a}{b}` | `((a) / (b))` |
| `\dfrac{a}{b}` | `((a) / (b))` |
| `\tfrac{a}{b}` | `((a) / (b))` |
| `\sqrt{x}` | `sqrt(x)` |
| `x^{2}` | `x^(2)` |
| `price_{net}` | `price_net` |
| `\left(a + b\right)` | `(a + b)` |
| `\min(a, b)` | `min(a, b)` |
| `\max(a, b)` | `max(a, b)` |
| `\round(x)` | `round(x)` |
| `\sin{x}` | `sin(x)` |
| `\cos{x}` | `cos(x)` |
| `\tan{x}` | `tan(x)` |
| `\log{x}` | `log(x)` |
| `\ln{x}` | `log(x)` |
| `\exp{x}` | `exp(x)` |
| `\abs{x}` | `abs(x)` |
| `\operatorname{round}(x)` | `round(x)` |
| `\operatorname{sqrt}(x)` | `sqrt(x)` |

不支持的 LaTeX 命令会返回 `INVALID_LATEX`，不会被静默转换成变量名。这个策略可以避免用户误以为复杂排版语法已经进入计算链路。

## `parseLatexFormula(source)`

返回原始输入、转换后的表达式、变量和解析错误。

```ts
parseLatexFormula('\\sqrt{price + tax}');
```

## `calculateLatexFormula(source, values)`

先转换 LaTeX，再复用 core 计算。

```ts
calculateLatexFormula('\\frac{price \\times count}{discount}', {
  price: 100,
  count: 2,
  discount: 4,
});
```

## `createLatexFormulaSchema(options)`

把 LaTeX 输入转换成 `FormulaSchema`，可以直接交给 React 适配器渲染。

```ts
createLatexFormulaSchema({
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
```

## `createLatexFormulaCalculator(options)`

返回解析结果、schema 和可复用的 `calculate(values)`。

```ts
const calculator = createLatexFormulaCalculator({
  source: '\\frac{price \\times count}{discount}',
});

calculator.expression;
// '((price * count) / (discount))'

calculator.calculate({ price: 100, count: 2, discount: 4 });
// { value: 50, errors: [] }
```
