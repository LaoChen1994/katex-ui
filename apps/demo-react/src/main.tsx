import React from 'react';
import ReactDOM from 'react-dom/client';
import { createLatexFormulaCalculator } from 'katex-ui/parser';
import { FormulaForm } from 'katex-ui-react';
import type { FormulaCalculationResult, FormulaValues } from 'katex-ui/core';
import type { FormulaField } from 'katex-ui/schema';
import './styles.css';

const orderExample = {
  name: '订单折扣',
  source: '\\frac{price \\times count}{discount}',
  fields: [
    { name: 'price', label: '单价', defaultValue: 99 },
    { name: 'count', label: '数量', defaultValue: 2 },
    { name: 'discount', label: '折扣因子', defaultValue: 4 },
  ],
};

const examples = [
  orderExample,
  {
    name: '税后金额',
    source: 'amount \\times (1 + taxRate)',
    fields: [
      { name: 'amount', label: '金额', defaultValue: 1000 },
      { name: 'taxRate', label: '税率', defaultValue: 0.06 },
    ],
  },
];

const App = () => {
  const [activeExample, setActiveExample] = React.useState(orderExample);
  const [source, setSource] = React.useState(activeExample.source);
  const [fields, setFields] = React.useState<FormulaField[]>(
    activeExample.fields,
  );
  const [values, setValues] = React.useState<FormulaValues>({});
  const [result, setResult] = React.useState<FormulaCalculationResult>({
    value: null,
    errors: [],
  });

  const calculator = React.useMemo(
    () =>
      createLatexFormulaCalculator({
        source,
        fields,
        result: {
          label: '结果',
          precision: 12,
        },
      }),
    [fields, source],
  );
  const { schema } = calculator;

  const updateField = (
    name: string,
    field: Pick<FormulaField, 'defaultValue' | 'label' | 'min'>,
  ) => {
    setFields((currentFields) => {
      const nextFields = currentFields.map((currentField) =>
        currentField.name === name
          ? {
              ...currentField,
              ...field,
            }
          : currentField,
      );

      if (nextFields.some((currentField) => currentField.name === name)) {
        return nextFields;
      }

      return [
        ...nextFields,
        {
          name,
          ...field,
        },
      ];
    });
  };

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
                  setSource(nextExample.source);
                  setFields(nextExample.fields);
                  setValues({});
                  setResult({
                    value: null,
                    errors: [],
                  });
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
            <label className="label" htmlFor="source">
              LaTeX 公式
            </label>
            <input
              id="source"
              value={source}
              onChange={(event) => setSource(event.target.value)}
              spellCheck={false}
            />
          </div>

          <div>
            <h2>计算表达式</h2>
            <pre>{calculator.expression || 'LaTeX formula is invalid.'}</pre>
          </div>

          <div>
            <h2>字段配置</h2>
            <div className="field-config">
              {schema.fields.map((field) => (
                <div className="field-config-row" key={field.name}>
                  <div>
                    <span className="field-name">{field.name}</span>
                  </div>
                  <label>
                    <span>标签</span>
                    <input
                      value={field.label ?? field.name}
                      onChange={(event) =>
                        updateField(field.name, {
                          label: event.target.value,
                        })
                      }
                    />
                  </label>
                  <label>
                    <span>默认值</span>
                    <input
                      inputMode="decimal"
                      value={
                        typeof field.defaultValue === 'number' ||
                        typeof field.defaultValue === 'string'
                          ? field.defaultValue
                          : ''
                      }
                      onChange={(event) => {
                        const nextValue = Number(event.target.value);

                        updateField(field.name, {
                          defaultValue:
                            event.target.value === '' ||
                            !Number.isFinite(nextValue)
                              ? undefined
                              : nextValue,
                        });
                      }}
                    />
                  </label>
                  <label>
                    <span>最小值</span>
                    <input
                      inputMode="decimal"
                      value={field.min ?? ''}
                      onChange={(event) => {
                        const nextValue = Number(event.target.value);

                        updateField(field.name, {
                          min:
                            event.target.value === '' ||
                            !Number.isFinite(nextValue)
                              ? undefined
                              : nextValue,
                        });
                      }}
                    />
                  </label>
                </div>
              ))}
              {schema.fields.length === 0 && (
                <p className="empty-state">当前公式没有可配置字段。</p>
              )}
            </div>
          </div>

          <div>
            <h2>计算器配置 JSON</h2>
            <pre>{JSON.stringify(calculator.config, null, 2)}</pre>
          </div>

          <div>
            <h2>渲染 schema</h2>
            <pre>{JSON.stringify(schema, null, 2)}</pre>
          </div>
        </div>

        <div className="form-panel">
          <div>
            <h1>katex-ui</h1>
            <p>输入 LaTeX 公式，生成动态表单，并实时计算结果。</p>
          </div>

          <FormulaForm
            key={source}
            schema={schema}
            initialValues={Object.fromEntries(
              schema.fields.map((field) => [field.name, field.defaultValue]),
            )}
            onValuesChange={setValues}
            onResult={setResult}
            resultClassName="result-bar"
            showResult
          />

          {[...calculator.errors, ...result.errors].length > 0 && (
            <ul className="error-list">
              {[...calculator.errors, ...result.errors].map((error, index) => (
                <li key={`${error.code}-${error.message}-${index}`}>
                  {error.message}
                </li>
              ))}
            </ul>
          )}

          <div>
            <h2>当前表单值</h2>
            <pre>{JSON.stringify(values, null, 2)}</pre>
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
