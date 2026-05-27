import { extractVariables } from '../core/index.js';
import type { FormulaValue } from '../core/index.js';

export type FormulaFieldValueType = 'number' | 'string' | 'boolean';

export type FormulaFieldOption = {
  label: string;
  value: string | number;
};

export type FormulaFieldLayout = 'vertical' | 'horizontal' | 'none';

export type FormulaField = {
  name: string;
  label?: string;
  valueType?: FormulaFieldValueType;
  required?: boolean;
  defaultValue?: FormulaValue;
  placeholder?: string;
  description?: string;
  options?: FormulaFieldOption[];
  min?: number;
  max?: number;
  step?: number;
  layout?: FormulaFieldLayout;
  componentProps?: Record<string, unknown>;
};

export type FormulaResultSchema = {
  label?: string;
  fallback?: string;
  precision?: number;
};

export type FormulaSchema = {
  expression: string;
  fields: FormulaField[];
  result?: FormulaResultSchema;
};

export type CreateFormulaSchemaOptions = {
  expression: string;
  fields?: FormulaField[];
  result?: FormulaResultSchema;
};

export const createFormulaSchema = (
  expressionOrOptions: string | CreateFormulaSchemaOptions,
  fields: FormulaField[] = [],
): FormulaSchema => {
  const expression =
    typeof expressionOrOptions === 'string'
      ? expressionOrOptions
      : expressionOrOptions.expression;

  return normalizeFormulaSchema({
    expression,
    fields:
      typeof expressionOrOptions === 'string'
        ? fields
        : expressionOrOptions.fields ?? [],
    result:
      typeof expressionOrOptions === 'string'
        ? undefined
        : expressionOrOptions.result,
  });
};

export const normalizeFormulaSchema = (schema: FormulaSchema): FormulaSchema => {
  const configuredFields = new Map(
    schema.fields.map((field) => [field.name, field]),
  );

  return {
    expression: schema.expression,
    fields: extractVariables(schema.expression).map((name) => ({
      name,
      label: name,
      valueType: 'number',
      required: true,
      ...configuredFields.get(name),
    })),
    ...(schema.result ? { result: schema.result } : {}),
  };
};
