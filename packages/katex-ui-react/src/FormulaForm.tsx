import { useEffect, useMemo, useRef } from 'react';
import { calculateFormula } from 'katex-ui/core';
import type { FormulaCalculationResult, FormulaValues } from 'katex-ui/core';
import type { FormulaSchema } from 'katex-ui/schema';
import type { FieldComponentMap } from 'pdyform-react';
import { FormElementRenderer, useForm } from 'pdyform-react';
import { toPdyformSchema } from './toPdyformSchema.js';

export type FormulaFormValues = FormulaValues;

export type FormulaFormResult = FormulaCalculationResult;

export type FormulaFormProps = {
  schema: FormulaSchema;
  className?: string;
  componentMap?: FieldComponentMap;
  initialValues?: FormulaFormValues;
  onChange?: (values: FormulaFormValues) => void;
  onResult?: (result: FormulaFormResult) => void;
};

export const FormulaForm = ({
  schema,
  className,
  componentMap,
  initialValues,
  onChange,
  onResult,
}: FormulaFormProps) => {
  const formSchema = useMemo(() => toPdyformSchema(schema), [schema]);
  const form = useForm({ schema: formSchema });
  const { setValue, state } = form;
  const initializedValuesSignature = useRef<string>();

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
    onResult?.(calculateFormula(schema.expression, values));
  }, [onChange, onResult, schema.expression, state.values]);

  return (
    <div className={className}>
      <FormElementRenderer
        elements={formSchema.fields ?? []}
        form={form}
        componentMap={componentMap}
      />
    </div>
  );
};
