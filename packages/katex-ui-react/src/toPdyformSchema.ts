import type { FormSchema } from 'pdyform-core';
import type { FormulaSchema } from 'katex-ui/schema';

export const toPdyformSchema = (schema: FormulaSchema): FormSchema => ({
  fields: schema.fields.map((field) => ({
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
    componentProps:
      field.valueType === 'number'
        ? {
            inputMode: 'decimal',
          }
        : undefined,
    validations: field.required
      ? [
          {
            type: 'required',
            message: `${field.label ?? field.name} is required.`,
          },
        ]
      : undefined,
  })),
  submitButtonText: 'Calculate',
});
