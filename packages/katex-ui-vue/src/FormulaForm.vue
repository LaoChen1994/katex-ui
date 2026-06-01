<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { calculateFormula, formatFormulaValue } from 'katex-ui/core';
import type { FormulaField } from 'katex-ui/schema';
import type {
  FormulaFormProps,
  FormulaFormResult,
  FormulaFormValues,
} from './types.js';

defineOptions({
  name: 'FormulaForm',
});

const props = withDefaults(defineProps<FormulaFormProps>(), {
  showResult: false,
});

const emit = defineEmits<{
  change: [values: FormulaFormValues];
  result: [result: FormulaFormResult];
  valuesChange: [values: FormulaFormValues];
}>();

const getInitialValues = (
  schema: FormulaFormProps['schema'],
  initialValues: FormulaFormValues | undefined,
): FormulaFormValues => {
  const values: FormulaFormValues = {};

  for (const field of schema.fields) {
    if (field.defaultValue !== undefined) {
      values[field.name] = field.defaultValue;
    }
  }

  return {
    ...values,
    ...(initialValues ?? {}),
  };
};

const getFieldValueType = (field: FormulaField) => field.valueType ?? 'number';

const getInputValue = (field: FormulaField, nextValues: FormulaFormValues) => {
  const value = nextValues[field.name];

  if (
    typeof value === 'number' ||
    typeof value === 'string' ||
    typeof value === 'boolean'
  ) {
    return value;
  }

  return getFieldValueType(field) === 'boolean' ? false : '';
};

const values = ref<FormulaFormValues>(
  getInitialValues(props.schema, props.initialValues),
);
const result = computed(() => calculateFormula(props.schema.expression, values.value));
const renderedResult = computed(
  () =>
    props.formatResult?.(result.value) ??
    formatFormulaValue(result.value.value, {
      fallback: props.schema.result?.fallback,
      precision: props.schema.result?.precision ?? 12,
    }),
);

watch(
  () => [props.schema, props.initialValues] as const,
  () => {
    values.value = getInitialValues(props.schema, props.initialValues);
  },
  {
    deep: true,
  },
);

watch(
  values,
  (nextValues) => {
    emit('change', nextValues);
    emit('valuesChange', nextValues);
  },
  {
    deep: true,
    immediate: true,
  },
);

watch(
  result,
  (nextResult) => {
    emit('result', nextResult);
  },
  {
    immediate: true,
  },
);

const setFieldValue = (field: FormulaField, value: unknown) => {
  const nextValues = {
    ...values.value,
  };
  const valueType = getFieldValueType(field);

  if (valueType === 'number') {
    const numericValue = Number(value);
    nextValues[field.name] =
      value === '' || !Number.isFinite(numericValue) ? '' : numericValue;
  } else if (valueType === 'boolean') {
    nextValues[field.name] = value === true || value === 'true';
  } else if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    nextValues[field.name] = value;
  }

  values.value = nextValues;
};

const handleSelectChange = (field: FormulaField, event: Event) => {
  if (event.target instanceof HTMLSelectElement) {
    setFieldValue(field, event.target.value);
  }
};

const handleInput = (field: FormulaField, event: Event) => {
  if (event.target instanceof HTMLInputElement) {
    setFieldValue(
      field,
      getFieldValueType(field) === 'boolean'
        ? event.target.checked
        : event.target.value,
    );
  }
};
</script>

<template>
  <div :class="className">
    <div class="katex-ui-vue-form">
      <div
        v-for="field in schema.fields"
        :key="field.name"
        class="katex-ui-vue-field"
      >
        <label :for="field.name">{{ field.label ?? field.name }}</label>
        <select
          v-if="field.options && field.options.length > 0"
          :id="field.name"
          :name="field.name"
          :value="getInputValue(field, values)"
          @change="handleSelectChange(field, $event)"
        >
          <option
            v-for="option in field.options"
            :key="String(option.value)"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
        <input
          v-else
          :id="field.name"
          :checked="
            getFieldValueType(field) === 'boolean'
              ? Boolean(getInputValue(field, values))
              : undefined
          "
          :inputmode="getFieldValueType(field) === 'number' ? 'decimal' : undefined"
          :max="field.max"
          :min="field.min"
          :name="field.name"
          :placeholder="field.placeholder"
          :step="field.step"
          :type="getFieldValueType(field) === 'boolean' ? 'checkbox' : 'text'"
          :value="
            getFieldValueType(field) === 'boolean'
              ? undefined
              : getInputValue(field, values)
          "
          @input="handleInput(field, $event)"
        />
        <small
          v-if="field.description"
          class="katex-ui-vue-field-description"
        >
          {{ field.description }}
        </small>
      </div>
    </div>
    <div
      v-if="showResult"
      :class="resultClassName"
    >
      <span>{{ resultLabel ?? schema.result?.label ?? 'Result' }}</span>
      <strong>{{ renderedResult }}</strong>
    </div>
  </div>
</template>
