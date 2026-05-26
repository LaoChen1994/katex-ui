# Schema API

## `createFormulaSchema(expression, fields?)`

根据公式变量生成 `FormulaSchema`，并用传入的字段配置覆盖默认字段。

```ts
const schema = createFormulaSchema('price * count', [
  { name: 'price', label: '单价' },
]);
```
