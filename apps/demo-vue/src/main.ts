import { computed, createApp, defineComponent, h, reactive, ref } from 'vue';
import { createLatexFormulaCalculator } from 'katex-ui/parser';
import { FormulaForm } from 'katex-ui-vue';
import type { FormulaCalculationResult, FormulaValues } from 'katex-ui/core';
import './styles.css';

const examples = [
  {
    name: '订单折扣',
    source: '\\frac{price \\times count}{discount}',
    fields: [
      { name: 'price', label: '单价', defaultValue: 99 },
      { name: 'count', label: '数量', defaultValue: 2 },
      { name: 'discount', label: '折扣因子', defaultValue: 4 },
    ],
  },
  {
    name: '税后金额',
    source: 'amount \\times (1 + taxRate)',
    fields: [
      { name: 'amount', label: '金额', defaultValue: 1000 },
      { name: 'taxRate', label: '税率', defaultValue: 0.06 },
    ],
  },
];

const App = defineComponent({
  name: 'App',
  setup() {
    const activeExampleName = ref(examples[0]?.name ?? '');
    const source = ref(examples[0]?.source ?? '');
    const fields = ref(examples[0]?.fields ?? []);
    const values = ref<FormulaValues>({});
    const result = ref<FormulaCalculationResult>({
      value: null,
      errors: [],
    });
    const calculator = computed(() =>
      createLatexFormulaCalculator({
        source: source.value,
        fields: fields.value,
        result: {
          label: '结果',
          precision: 12,
        },
      }),
    );
    const state = reactive({
      get schema() {
        return calculator.value.schema;
      },
    });

    return () =>
      h('main', { class: 'app-shell' }, [
        h('section', { class: 'workspace' }, [
          h('div', { class: 'editor-panel' }, [
            h('div', [
              h('label', { class: 'label', for: 'example' }, '示例'),
              h(
                'select',
                {
                  id: 'example',
                  value: activeExampleName.value,
                  onChange: (event: Event) => {
                    if (!(event.target instanceof HTMLSelectElement)) {
                      return;
                    }

                    const nextExampleName = event.target.value;
                    const nextExample = examples.find(
                      (example) => example.name === nextExampleName,
                    );

                    if (nextExample) {
                      activeExampleName.value = nextExample.name;
                      source.value = nextExample.source;
                      fields.value = nextExample.fields;
                      values.value = {};
                      result.value = {
                        value: null,
                        errors: [],
                      };
                    }
                  },
                },
                examples.map((example) =>
                  h('option', { key: example.name, value: example.name }, example.name),
                ),
              ),
            ]),
            h('div', [
              h('label', { class: 'label', for: 'source' }, 'LaTeX 公式'),
              h('input', {
                id: 'source',
                spellcheck: false,
                value: source.value,
                onInput: (event: Event) => {
                  if (event.target instanceof HTMLInputElement) {
                    source.value = event.target.value;
                  }
                },
              }),
            ]),
            h('div', [
              h('h2', '计算表达式'),
              h('pre', calculator.value.expression || 'LaTeX formula is invalid.'),
            ]),
            h('div', [
              h('h2', '计算器配置 JSON'),
              h('pre', JSON.stringify(calculator.value.config, null, 2)),
            ]),
          ]),
          h('div', { class: 'form-panel' }, [
            h('div', [
              h('h1', 'katex-ui-vue'),
              h('p', '输入 LaTeX 公式，生成 Vue 动态表单，并实时计算结果。'),
            ]),
            h(FormulaForm, {
              key: source.value,
              schema: state.schema,
              initialValues: Object.fromEntries(
                state.schema.fields.map((field) => [
                  field.name,
                  field.defaultValue,
                ]),
              ),
              onResult: (nextResult: FormulaCalculationResult) => {
                result.value = nextResult;
              },
              onValuesChange: (nextValues: FormulaValues) => {
                values.value = nextValues;
              },
              resultClassName: 'result-bar',
              showResult: true,
            }),
            result.value.errors.length > 0
              ? h(
                  'ul',
                  { class: 'error-list' },
                  result.value.errors.map((error, index) =>
                    h('li', { key: `${error.code}-${index}` }, error.message),
                  ),
                )
              : undefined,
            h('div', [
              h('h2', '当前表单值'),
              h('pre', JSON.stringify(values.value, null, 2)),
            ]),
          ]),
        ]),
      ]);
  },
});

createApp(App).mount('#app');
