# React

安装 React 适配包：

```bash
pnpm add katex-ui katex-ui-react pdyform-core pdyform-react
```

使用动态公式表单：

```tsx
import { createFormulaSchema } from 'katex-ui/schema';
import { FormulaForm } from 'katex-ui-react';

const schema = createFormulaSchema('price * count', [
  { name: 'price', label: '单价', defaultValue: 10 },
  { name: 'count', label: '数量', defaultValue: 3 },
]);

export const Demo = () => (
  <FormulaForm
    schema={schema}
    onResult={(result) => {
      console.log(result.value);
    }}
  />
);
```
