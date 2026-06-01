import { computed, defineComponent, h, ref, watch } from 'vue';
import type { PropType, VNodeChild } from 'vue';
import { calculateFormula, formatFormulaValue } from 'katex-ui/core';
import type { FormulaCalculationResult, FormulaValues } from 'katex-ui/core';
import type { FormulaField, FormulaSchema } from 'katex-ui/schema';

export type FormulaFormValues = FormulaValues;

export type FormulaFormResult = FormulaCalculationResult;

export type FormulaFormProps = {
  schema: FormulaSchema;
  className?: string;
  formatResult?: (result: FormulaFormResult) => VNodeChild;
  initialValues?: FormulaFormValues;
  resultClassName?: string;
  resultLabel?: string;
  showResult?: boolean;
};

const getInitialValues = (
  schema: FormulaSchema,
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

const getInputValue = (field: FormulaField, values: FormulaFormValues) => {
  const value = values[field.name];

  if (
    typeof value === 'number' ||
    typeof value === 'string' ||
    typeof value === 'boolean'
  ) {
    return value;
  }

  return field.valueType === 'boolean' ? false : '';
};

const getFieldValueType = (field: FormulaField) => field.valueType ?? 'number';

export const FormulaForm = defineComponent({
  name: 'FormulaForm',
  props: {
    schema: {
      type: Object as PropType<FormulaSchema>,
      required: true,
    },
    className: String,
    formatResult: Function as PropType<
      (result: FormulaFormResult) => VNodeChild
    >,
    initialValues: Object as PropType<FormulaFormValues>,
    resultClassName: String,
    resultLabel: String,
    showResult: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['change', 'result', 'valuesChange'],
  setup(props, { emit }) {
    const values = ref<FormulaFormValues>(
      getInitialValues(props.schema, props.initialValues),
    );
    const result = computed(() => calculateFormula(props.schema.expression, values.value));

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
          value === '' || !Number.isFinite(numericValue)
            ? ''
            : numericValue;
      } else if (valueType === 'boolean') {
        nextValues[field.name] = Boolean(value);
      } else if (
        typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'boolean'
      ) {
        nextValues[field.name] = value;
      }

      values.value = nextValues;
    };

    return () => {
      const renderedResult =
        props.formatResult?.(result.value) ??
        formatFormulaValue(result.value.value, {
          fallback: props.schema.result?.fallback,
          precision: props.schema.result?.precision ?? 12,
        });

      return h('div', { class: props.className }, [
        h(
          'div',
          { class: 'katex-ui-vue-form' },
          props.schema.fields.map((field) =>
            h('div', { class: 'katex-ui-vue-field', key: field.name }, [
              h('label', { for: field.name }, field.label ?? field.name),
              field.options && field.options.length > 0
                ? h(
                    'select',
                    {
                      id: field.name,
                      name: field.name,
                      value: getInputValue(field, values.value),
                      onChange: (event: Event) => {
                        if (event.target instanceof HTMLSelectElement) {
                          setFieldValue(field, event.target.value);
                        }
                      },
                    },
                    field.options.map((option) =>
                      h(
                        'option',
                        {
                          key: String(option.value),
                          value: option.value,
                        },
                        option.label,
                      ),
                    ),
                  )
                : h('input', {
                    id: field.name,
                    name: field.name,
                    checked:
                      getFieldValueType(field) === 'boolean'
                        ? Boolean(getInputValue(field, values.value))
                        : undefined,
                    inputmode:
                      getFieldValueType(field) === 'number'
                        ? 'decimal'
                        : undefined,
                    max: field.max,
                    min: field.min,
                    placeholder: field.placeholder,
                    step: field.step,
                    type:
                      getFieldValueType(field) === 'boolean'
                        ? 'checkbox'
                        : 'text',
                    value:
                      getFieldValueType(field) === 'boolean'
                        ? undefined
                        : getInputValue(field, values.value),
                    onInput: (event: Event) => {
                      if (event.target instanceof HTMLInputElement) {
                        setFieldValue(
                          field,
                          getFieldValueType(field) === 'boolean'
                            ? event.target.checked
                            : event.target.value,
                        );
                      }
                    },
                  }),
              field.description
                ? h(
                    'small',
                    { class: 'katex-ui-vue-field-description' },
                    field.description,
                  )
                : undefined,
            ]),
          ),
        ),
        props.showResult
          ? h('div', { class: props.resultClassName }, [
              h('span', props.resultLabel ?? props.schema.result?.label ?? 'Result'),
              h('strong', renderedResult),
            ])
          : undefined,
      ]);
    };
  },
});
