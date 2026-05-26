import { extractVariables } from '../core/index.js';
import type { FormulaValue } from '../core/index.js';

export type FormulaFieldValueType = 'number' | 'string' | 'boolean';

export type FormulaFieldOption = {
  label: string;
  value: string | number;
};

export type FormulaField = {
  name: string;
  label?: string;
  valueType?: FormulaFieldValueType;
  required?: boolean;
  defaultValue?: FormulaValue;
  placeholder?: string;
  description?: string;
  options?: FormulaFieldOption[];
};

export type FormulaSchema = {
  expression: string;
  fields: FormulaField[];
};

export const createFormulaSchema = (
  expression: string,
  fields: FormulaField[] = [],
): FormulaSchema => {
  const configuredFields = new Map(fields.map((field) => [field.name, field]));

  return {
    expression,
    fields: extractVariables(expression).map((name) => ({
      name,
      label: name,
      valueType: 'number',
      required: true,
      ...configuredFields.get(name),
    })),
  };
};
