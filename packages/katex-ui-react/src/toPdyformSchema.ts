import type { FormSchema, ValidationRule } from 'pdyform-core';
import type { FormulaSchema } from 'katex-ui/schema';

export const toPdyformSchema = (schema: FormulaSchema): FormSchema => ({
  fields: schema.fields.map((field) => {
    const validations: ValidationRule[] = [];

    if (field.required) {
      validations.push({
        type: 'required',
        message: `${field.label ?? field.name} is required.`,
      });
    }

    if (field.min !== undefined) {
      validations.push({
        type: 'min',
        value: field.min,
        message: `${field.label ?? field.name} must be at least ${field.min}.`,
      });
    }

    if (field.max !== undefined) {
      validations.push({
        type: 'max',
        value: field.max,
        message: `${field.label ?? field.name} must be at most ${field.max}.`,
      });
    }

    return {
      id: field.name,
      name: field.name,
      label: field.label ?? field.name,
      type:
        field.options && field.options.length > 0
          ? 'select'
          : field.valueType === 'boolean'
            ? 'switch'
            : 'text',
      placeholder: field.placeholder,
      description: field.description,
      defaultValue: field.defaultValue,
      options: field.options,
      layout: field.layout,
      componentProps:
        field.valueType === 'number' && !field.options
          ? {
              inputMode: 'decimal',
              ...(field.min === undefined ? {} : { min: field.min }),
              ...(field.max === undefined ? {} : { max: field.max }),
              ...(field.step === undefined ? {} : { step: field.step }),
              ...field.componentProps,
            }
          : field.componentProps,
      validations: validations.length > 0 ? validations : undefined,
    };
  }),
  submitButtonText: 'Calculate',
});
