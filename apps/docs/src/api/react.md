# React API

## `FormulaForm`

`FormulaForm` 接收 `FormulaSchema`，内部转换成 `pdyform-react` schema 并实时计算结果。

```tsx
<FormulaForm
  schema={schema}
  showResult
  resultClassName="result"
  onValuesChange={(values) => console.log(values)}
  onResult={(result) => console.log(result)}
/>
```

## Result Rendering

```tsx
<FormulaForm
  schema={schema}
  showResult
  formatResult={(result) =>
    result.value === null ? '-' : `$${result.value.toFixed(2)}`
  }
/>
```

## pdyform Schema Debugging

```tsx
<FormulaForm
  schema={schema}
  onPdyformSchema={(pdyformSchema) => {
    console.log(pdyformSchema);
  }}
/>
```
