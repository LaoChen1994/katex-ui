# Core API

## `extractVariables(expression)`

从公式表达式中提取变量名。

## `extractFunctions(expression)`

从公式表达式中提取函数名。

```ts
extractFunctions('round(max(price, floor(base * rate)))');
// ['round', 'max', 'floor']
```

## `validateFormula(expression)`

校验公式语法，返回 `{ valid, errors }`。

## `validateFormulaPolicy(expression, policy)`

在语法校验之外，额外限制可用函数、可用变量和表达式长度。

```ts
validateFormulaPolicy('round(price * count)', {
  allowedFunctions: ['round'],
  allowedVariables: ['price', 'count'],
  maxExpressionLength: 64,
});
```

## `calculateFormula(expression, values)`

计算公式，返回 `{ value, errors }`。结果限定为有限数字。

```ts
calculateFormula('price * count', {
  price: 10,
  count: 3,
});
```

## `formatFormulaValue(value, options?)`

把计算结果格式化为适合展示的字符串。

```ts
formatFormulaValue(237.60000000000002, { precision: 12 });
// '237.6'
```

## `getFormulaSummary(expression)`

一次性返回表达式、变量、合法性和错误。

```ts
getFormulaSummary('price * count');
```

## `createFormulaRunner(expression)`

预编译公式，适合表单实时计算。

```ts
const runner = createFormulaRunner('price * count');
runner.calculate({ price: 10, count: 3 });
```

## `calculateFormulaBatch(definitions, values)`

按顺序计算一组公式，并把前面公式的结果写回后续公式可用的 values。

```ts
calculateFormulaBatch(
  [
    { name: 'subtotal', expression: 'price * count' },
    { name: 'tax', expression: 'subtotal * taxRate' },
    { name: 'total', expression: 'subtotal + tax' },
  ],
  { price: 100, count: 2, taxRate: 0.06 },
);
```

## 支持的表达式范围

core 计算层使用内置有限 evaluator，不执行任意 JavaScript。当前支持：

- 数字、变量、括号、一元 `+` 和 `-`
- `+`、`-`、`*`、`/`、`%`、`^`
- `abs`、`ceil`、`cos`、`exp`、`floor`、`log`、`max`、`min`、`round`、`sin`、`sqrt`、`tan`
