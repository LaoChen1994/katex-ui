# React

安装 React 适配包：

```bash
pnpm add katex-ui katex-ui-react pdyform-core pdyform-react
```

使用动态公式表单：

```tsx
import { createFormulaSchema } from 'katex-ui/schema';
import { FormulaForm } from 'katex-ui-react';

const schema = createFormulaSchema({
  expression: 'price * count',
  fields: [
    { name: 'price', label: '单价', defaultValue: 10, min: 0 },
    { name: 'count', label: '数量', defaultValue: 3, min: 1 },
  ],
  result: {
    label: '总价',
    precision: 12,
  },
});

export const Demo = () => (
  <FormulaForm
    schema={schema}
    showResult
    onValuesChange={(values) => {
      console.log(values);
    }}
    onResult={(result) => {
      console.log(result.value);
    }}
  />
);
```
