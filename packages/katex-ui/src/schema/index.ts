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

export type FormulaCalculatorConfig = FormulaSchema;

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

export const mergeFormulaFields = (
  expression: string,
  fields: FormulaField[] = [],
): FormulaField[] => {
  const configuredFields = new Map(fields.map((field) => [field.name, field]));

  return extractVariables(expression).map((name) => ({
    name,
    label: name,
    valueType: 'number',
    required: true,
    ...configuredFields.get(name),
  }));
};

export const normalizeFormulaSchema = (schema: FormulaSchema): FormulaSchema => {
  return {
    expression: schema.expression,
    fields: mergeFormulaFields(schema.expression, schema.fields),
    ...(schema.result ? { result: schema.result } : {}),
  };
};

export const createFormulaCalculatorConfig = (
  options: CreateFormulaSchemaOptions,
): FormulaCalculatorConfig => createFormulaSchema(options);
