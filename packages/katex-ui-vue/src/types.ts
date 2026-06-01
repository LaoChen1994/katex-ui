import type { FormulaCalculationResult, FormulaValues } from 'katex-ui/core';

export type FormulaFormValues = FormulaValues;

export type FormulaFormResult = FormulaCalculationResult;

export type FormulaFormProps = {
  schema: import('katex-ui/schema').FormulaSchema;
  className?: string;
  formatResult?: (result: FormulaFormResult) => number | string;
  initialValues?: FormulaFormValues;
  resultClassName?: string;
  resultLabel?: string;
  showResult?: boolean;
};
