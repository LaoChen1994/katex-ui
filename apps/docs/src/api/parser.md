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
| `\sqrt{x}` | `sqrt(x)` |
| `x^{2}` | `x^(2)` |
| `\min(a, b)` | `min(a, b)` |
| `\max(a, b)` | `max(a, b)` |

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
