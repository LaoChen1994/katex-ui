import { useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { calculateFormula, formatFormulaValue } from 'katex-ui/core';
import type { FormulaCalculationResult, FormulaValues } from 'katex-ui/core';
import type { FormulaSchema } from 'katex-ui/schema';
import type { FormSchema } from 'pdyform-core';
import type { FieldComponentMap } from 'pdyform-react';
import { FormElementRenderer, useForm } from 'pdyform-react';
import { toPdyformSchema } from './toPdyformSchema.js';

export type FormulaFormValues = FormulaValues;

export type FormulaFormResult = FormulaCalculationResult;

export type FormulaFormProps = {
  schema: FormulaSchema;
  className?: string;
  componentMap?: FieldComponentMap;
  formatResult?: (result: FormulaFormResult) => ReactNode;
  initialValues?: FormulaFormValues;
  onChange?: (values: FormulaFormValues) => void;
  onPdyformSchema?: (schema: FormSchema) => void;
  onResult?: (result: FormulaFormResult) => void;
  onValuesChange?: (values: FormulaFormValues) => void;
  resultClassName?: string;
  resultLabel?: string;
  showResult?: boolean;
};

export const FormulaForm = ({
  schema,
  className,
  componentMap,
  formatResult,
  initialValues,
  onChange,
  onPdyformSchema,
  onResult,
  onValuesChange,
  resultClassName,
  resultLabel,
  showResult = false,
}: FormulaFormProps) => {
  const formSchema = useMemo(() => toPdyformSchema(schema), [schema]);
  const form = useForm({ schema: formSchema });
  const { setValue, state } = form;
  const initializedValuesSignature = useRef<string>();
  const [result, setResult] = useState<FormulaFormResult>({
    value: null,
    errors: [],
  });

  useEffect(() => {
    onPdyformSchema?.(formSchema);
  }, [formSchema, onPdyformSchema]);

  useEffect(() => {
    if (!initialValues) {
      return;
    }

    const valuesSignature = JSON.stringify(initialValues);

    if (initializedValuesSignature.current === valuesSignature) {
      return;
    }

    initializedValuesSignature.current = valuesSignature;

    for (const [name, value] of Object.entries(initialValues)) {
      void setValue(name, value);
    }
  }, [initialValues, setValue]);

  useEffect(() => {
    const values: FormulaFormValues = {};

    for (const [name, value] of Object.entries(state.values)) {
      if (
        typeof value === 'number' ||
        typeof value === 'string' ||
        typeof value === 'boolean' ||
        value === null ||
        value === undefined
      ) {
        values[name] = value;
      }
    }

    onChange?.(values);
    onValuesChange?.(values);

    const nextResult = calculateFormula(schema.expression, values);

    setResult(nextResult);
    onResult?.(nextResult);
  }, [onChange, onResult, onValuesChange, schema.expression, state.values]);

  const renderedResult =
    formatResult?.(result) ??
    formatFormulaValue(result.value, {
      fallback: schema.result?.fallback,
      precision: schema.result?.precision ?? 12,
    });

  return (
    <div className={className}>
      <FormElementRenderer
        elements={formSchema.fields ?? []}
        form={form}
        componentMap={componentMap}
      />
      {showResult && (
        <div className={resultClassName}>
          <span>{resultLabel ?? schema.result?.label ?? 'Result'}</span>
          <strong>{renderedResult}</strong>
        </div>
      )}
    </div>
  );
};
