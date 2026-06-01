<script setup lang="ts">
import { computed, ref } from 'vue';
import { createLatexFormulaCalculator } from 'katex-ui/parser';
import { FormulaForm } from 'katex-ui-vue';
import type { FormulaCalculationResult, FormulaValues } from 'katex-ui/core';
import type { FormulaField } from 'katex-ui/schema';

type Example = {
  name: string;
  source: string;
  fields: FormulaField[];
};

const examples: Example[] = [
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

const activeExampleName = ref(examples[0]?.name ?? '');
const source = ref(examples[0]?.source ?? '');
const fields = ref<FormulaField[]>(examples[0]?.fields ?? []);
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
const initialValues = computed(() =>
  Object.fromEntries(
    calculator.value.schema.fields.map((field) => [
      field.name,
      field.defaultValue,
    ]),
  ),
);

const selectExample = () => {
  const nextExample = examples.find(
    (example) => example.name === activeExampleName.value,
  );

  if (nextExample) {
    source.value = nextExample.source;
    fields.value = nextExample.fields;
    values.value = {};
    result.value = {
      value: null,
      errors: [],
    };
  }
};
</script>

<template>
  <main class="app-shell">
    <section class="workspace">
      <div class="editor-panel">
        <div>
          <label
            class="label"
            for="example"
          >
            示例
          </label>
          <select
            id="example"
            v-model="activeExampleName"
            @change="selectExample"
          >
            <option
              v-for="example in examples"
              :key="example.name"
              :value="example.name"
            >
              {{ example.name }}
            </option>
          </select>
        </div>
        <div>
          <label
            class="label"
            for="source"
          >
            LaTeX 公式
          </label>
          <input
            id="source"
            v-model="source"
            spellcheck="false"
          />
        </div>
        <div>
          <h2>计算表达式</h2>
          <pre>{{ calculator.expression || 'LaTeX formula is invalid.' }}</pre>
        </div>
        <div>
          <h2>计算器配置 JSON</h2>
          <pre>{{ JSON.stringify(calculator.config, null, 2) }}</pre>
        </div>
      </div>
      <div class="form-panel">
        <div>
          <h1>katex-ui-vue</h1>
          <p>输入 LaTeX 公式，生成 Vue 动态表单，并实时计算结果。</p>
        </div>
        <FormulaForm
          :key="source"
          :initial-values="initialValues"
          :schema="calculator.schema"
          result-class-name="result-bar"
          show-result
          @result="(nextResult) => (result = nextResult)"
          @values-change="(nextValues) => (values = nextValues)"
        />
        <ul
          v-if="result.errors.length > 0"
          class="error-list"
        >
          <li
            v-for="(error, index) in result.errors"
            :key="`${error.code}-${index}`"
          >
            {{ error.message }}
          </li>
        </ul>
        <div>
          <h2>当前表单值</h2>
          <pre>{{ JSON.stringify(values, null, 2) }}</pre>
        </div>
      </div>
    </section>
  </main>
</template>
