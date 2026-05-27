import React from 'react';
import ReactDOM from 'react-dom/client';
import { createFormulaSchema } from 'katex-ui/schema';
import { FormulaForm } from 'katex-ui-react';
import { calculateFormulaBatch, formatFormulaValue } from 'katex-ui/core';
import type { FormulaCalculationResult, FormulaValues } from 'katex-ui/core';
import './styles.css';

const orderExample = {
  name: '订单折扣',
  expression: 'price * count * discount',
  fields: [
    { name: 'price', label: '单价', defaultValue: 99 },
    { name: 'count', label: '数量', defaultValue: 2 },
    { name: 'discount', label: '折扣', defaultValue: 0.8 },
  ],
};

const examples = [
  orderExample,
  {
    name: '税后金额',
    expression: 'amount * (1 + taxRate)',
    fields: [
      { name: 'amount', label: '金额', defaultValue: 1000 },
      { name: 'taxRate', label: '税率', defaultValue: 0.06 },
    ],
  },
];

const App = () => {
  const [activeExample, setActiveExample] = React.useState(orderExample);
  const [expression, setExpression] = React.useState(activeExample.expression);
  const [values, setValues] = React.useState<FormulaValues>({});
  const [result, setResult] = React.useState<FormulaCalculationResult>({
    value: null,
    errors: [],
  });

  const schema = React.useMemo(
    () =>
      createFormulaSchema({
        expression,
        fields: activeExample.fields,
        result: {
          label: '结果',
          precision: 12,
        },
      }),
    [activeExample.fields, expression],
  );

  const batchResult = React.useMemo(
    () =>
      calculateFormulaBatch(
        [
          { name: 'subtotal', expression: 'price * count' },
          { name: 'tax', expression: 'subtotal * taxRate' },
          { name: 'total', expression: 'subtotal + tax' },
        ],
        {
          price: values.price ?? 99,
          count: values.count ?? 2,
          taxRate: 0.06,
        },
      ),
    [values.count, values.price],
  );

  return (
    <main className="app-shell">
      <section className="workspace">
        <div className="editor-panel">
          <div>
            <label className="label" htmlFor="example">
              示例
            </label>
            <select
              id="example"
              value={activeExample.name}
              onChange={(event) => {
                const nextExample = examples.find(
                  (example) => example.name === event.target.value,
                );

                if (nextExample) {
                  setActiveExample(nextExample);
                  setExpression(nextExample.expression);
                }
              }}
            >
              {examples.map((example) => (
                <option key={example.name} value={example.name}>
                  {example.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label" htmlFor="expression">
              公式
            </label>
            <input
              id="expression"
              value={expression}
              onChange={(event) => setExpression(event.target.value)}
              spellCheck={false}
            />
          </div>

          <div>
            <h2>katex-ui schema</h2>
            <pre>{JSON.stringify(schema, null, 2)}</pre>
          </div>
        </div>

        <div className="form-panel">
          <div>
            <h1>katex-ui</h1>
            <p>输入公式，生成动态表单，并实时计算结果。</p>
          </div>

          <FormulaForm
            key={schema.expression}
            schema={schema}
            initialValues={Object.fromEntries(
              schema.fields.map((field) => [field.name, field.defaultValue]),
            )}
            onValuesChange={setValues}
            onResult={setResult}
            resultClassName="result-bar"
            showResult
          />

          {result.errors.length > 0 && (
            <ul className="error-list">
              {result.errors.map((error) => (
                <li key={`${error.code}-${error.variable ?? error.message}`}>
                  {error.message}
                </li>
              ))}
            </ul>
          )}

          <div>
            <h2>当前表单值</h2>
            <pre>{JSON.stringify(values, null, 2)}</pre>
          </div>

          <div>
            <h2>批量公式</h2>
            <div className="metric-grid">
              {Object.entries(batchResult.results).map(([name, item]) => (
                <div className="metric" key={name}>
                  <span>{name}</span>
                  <strong>
                    {formatFormulaValue(item.value, {
                      precision: 12,
                    })}
                  </strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
