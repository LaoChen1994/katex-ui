# LaTeX 支持范围

`katex-ui` 支持的是面向业务计算器的有限 LaTeX 子集，不是完整 TeX 语法。

## 支持

| LaTeX                                         | 转换结果                     |
| --------------------------------------------- | ---------------------------- |
| `\frac{a}{b}`、`\dfrac{a}{b}`、`\tfrac{a}{b}` | `(a) / (b)`                  |
| `\sqrt{x}`                                    | `sqrt(x)`                    |
| `x^{2}`                                       | `x^(2)`                      |
| `price_{net}`                                 | `price_net`                  |
| `\times`、`\cdot`、`\div`                     | `*`、`*`、`/`                |
| `\sin{x}`、`\cos{x}`、`\tan{x}`               | `sin(x)`、`cos(x)`、`tan(x)` |
| `\log{x}`、`\ln{x}`、`\exp{x}`                | `log(x)`、`log(x)`、`exp(x)` |
| `\abs{x}`、`\min`、`\max`、`\round`           | `abs`、`min`、`max`、`round` |
| `\operatorname{sin}` 等已知函数               | 对应表达式函数               |

## 不支持

- 完整 TeX 排版命令。
- 矩阵、分段函数、求和、积分、极限等高级数学结构。
- 自定义 LaTeX 宏。
- 无法转换成有限数值结果的表达式。

## 建议

在产品中保存公式前，先调用 `parseLatexFormula` 或 `createLatexFormulaCalculator` 检查 `errors`。如果 `errors` 不为空，不要发布该公式。
