# Schema API

## `createFormulaSchema(expression, fields?)`

根据公式变量生成 `FormulaSchema`，并用传入的字段配置覆盖默认字段。

```ts
const schema = createFormulaSchema('price * count', [
  { name: 'price', label: '单价' },
]);
```

## `createFormulaSchema(options)`

对象入参适合配置 result 和更多字段元信息。

```ts
const schema = createFormulaSchema({
  expression: 'price * count * discount',
  fields: [
    { name: 'price', label: '单价', defaultValue: 99, min: 0, step: 0.01 },
    { name: 'count', label: '数量', defaultValue: 2, min: 1 },
    { name: 'discount', label: '折扣', defaultValue: 0.8, min: 0, max: 1 },
  ],
  result: {
    label: '总价',
    precision: 12,
  },
});
```

## `normalizeFormulaSchema(schema)`

规范化已有 schema：按公式变量顺序补齐字段，过滤无关字段，并保留 result 配置。
