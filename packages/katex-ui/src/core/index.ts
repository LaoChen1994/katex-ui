import {
  evaluateArithmeticExpression,
  parseArithmeticExpression,
} from '../engines/index.js';
import type { ArithmeticExpression } from '../engines/index.js';

export type FormulaValue = number | string | boolean | null | undefined;

export type FormulaValues = Record<string, FormulaValue>;

export type FormulaErrorCode =
  | 'INVALID_EXPRESSION'
  | 'MISSING_VARIABLE'
  | 'INVALID_RESULT'
  | 'DISALLOWED_FUNCTION'
  | 'DISALLOWED_VARIABLE'
  | 'EXPRESSION_TOO_LONG';

export type FormulaError = {
  code: FormulaErrorCode;
  message: string;
  function?: string;
  variable?: string;
};

export type FormulaValidationResult = {
  valid: boolean;
  errors: FormulaError[];
};

export type FormulaCalculationResult = {
  value: number | null;
  errors: FormulaError[];
};

export type FormulaFormatOptions = {
  fallback?: string;
  locale?: string;
  maximumFractionDigits?: number;
  minimumFractionDigits?: number;
  precision?: number;
};

export type FormulaSummary = {
  expression: string;
  variables: string[];
  valid: boolean;
  errors: FormulaError[];
};

export type FormulaRunner = {
  expression: string;
  variables: string[];
  calculate: (values: FormulaValues) => FormulaCalculationResult;
};

export type FormulaPolicy = {
  allowedFunctions?: string[];
  allowedVariables?: string[];
  maxExpressionLength?: number;
};

export type FormulaBatchDefinition = {
  name: string;
  expression: string;
};

export type FormulaBatchResult = {
  values: FormulaValues;
  results: Record<string, FormulaCalculationResult>;
  errors: FormulaError[];
};

export const extractVariables = (expression: string): string[] => {
  if (!expression.trim()) {
    return [];
  }

  try {
    return parseArithmeticExpression(expression).variables;
  } catch {
    return [];
  }
};

export const extractFunctions = (expression: string): string[] => {
  if (!expression.trim()) {
    return [];
  }

  try {
    return parseArithmeticExpression(expression).functions;
  } catch {
    return [];
  }
};

export const validateFormula = (
  expression: string,
): FormulaValidationResult => {
  if (!expression.trim()) {
    return {
      valid: false,
      errors: [
        {
          code: 'INVALID_EXPRESSION',
          message: 'Formula expression is required.',
        },
      ],
    };
  }

  try {
    parseArithmeticExpression(expression);
    return {
      valid: true,
      errors: [],
    };
  } catch (error) {
    return {
      valid: false,
      errors: [
        {
          code: 'INVALID_EXPRESSION',
          message:
            error instanceof Error
              ? error.message
              : 'Formula expression is invalid.',
        },
      ],
    };
  }
};

export const validateFormulaPolicy = (
  expression: string,
  policy: FormulaPolicy,
): FormulaValidationResult => {
  const errors: FormulaError[] = [];

  if (
    policy.maxExpressionLength !== undefined &&
    expression.length > policy.maxExpressionLength
  ) {
    errors.push({
      code: 'EXPRESSION_TOO_LONG',
      message: `Formula expression must be at most ${policy.maxExpressionLength} characters.`,
    });
  }

  const validation = validateFormula(expression);

  if (!validation.valid) {
    errors.push(...validation.errors);

    return {
      valid: false,
      errors,
    };
  }

  if (policy.allowedFunctions) {
    for (const functionName of extractFunctions(expression)) {
      if (!policy.allowedFunctions.includes(functionName)) {
        errors.push({
          code: 'DISALLOWED_FUNCTION',
          function: functionName,
          message: `Function "${functionName}" is not allowed.`,
        });
      }
    }
  }

  if (policy.allowedVariables) {
    for (const variable of extractVariables(expression)) {
      if (!policy.allowedVariables.includes(variable)) {
        errors.push({
          code: 'DISALLOWED_VARIABLE',
          message: `Variable "${variable}" is not allowed.`,
          variable,
        });
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

export const formatFormulaValue = (
  value: number | null | undefined,
  options: FormulaFormatOptions = {},
): string => {
  const fallback = options.fallback ?? '-';

  if (value === null || value === undefined || !Number.isFinite(value)) {
    return fallback;
  }

  const normalizedValue =
    options.precision === undefined
      ? value
      : Number(value.toPrecision(options.precision));

  if (
    options.locale ||
    options.minimumFractionDigits !== undefined ||
    options.maximumFractionDigits !== undefined
  ) {
    return new Intl.NumberFormat(options.locale, {
      maximumFractionDigits: options.maximumFractionDigits,
      minimumFractionDigits: options.minimumFractionDigits,
    }).format(normalizedValue);
  }

  return String(normalizedValue);
};

export const getFormulaSummary = (expression: string): FormulaSummary => {
  const validation = validateFormula(expression);

  return {
    expression,
    variables: validation.valid ? extractVariables(expression) : [],
    valid: validation.valid,
    errors: validation.errors,
  };
};

export const createFormulaRunner = (expression: string): FormulaRunner => {
  let parsedExpression: ArithmeticExpression | null = null;
  const validation = validateFormula(expression);

  if (validation.valid) {
    parsedExpression = parseArithmeticExpression(expression);
  }

  const variables = validation.valid ? (parsedExpression?.variables ?? []) : [];

  return {
    expression,
    variables,
    calculate: (values) => {
      if (!validation.valid || !parsedExpression) {
        return {
          value: null,
          errors: validation.errors,
        };
      }

      const missingErrors: FormulaError[] = variables
        .filter(
          (variable) =>
            values[variable] === undefined ||
            values[variable] === null ||
            values[variable] === '',
        )
        .map((variable) => ({
          code: 'MISSING_VARIABLE',
          message: `Variable "${variable}" is required.`,
          variable,
        }));

      if (missingErrors.length > 0) {
        return {
          value: null,
          errors: missingErrors,
        };
      }

      try {
        const result = evaluateArithmeticExpression(parsedExpression, values);

        if (typeof result !== 'number' || !Number.isFinite(result)) {
          return {
            value: null,
            errors: [
              {
                code: 'INVALID_RESULT',
                message: 'Formula result must be a finite number.',
              },
            ],
          };
        }

        return {
          value: result,
          errors: [],
        };
      } catch (error) {
        return {
          value: null,
          errors: [
            {
              code: 'INVALID_EXPRESSION',
              message:
                error instanceof Error
                  ? error.message
                  : 'Formula calculation failed.',
            },
          ],
        };
      }
    },
  };
};

export const calculateFormula = (
  expression: string,
  values: FormulaValues,
): FormulaCalculationResult => {
  return createFormulaRunner(expression).calculate(values);
};

export const calculateFormulaBatch = (
  definitions: FormulaBatchDefinition[],
  values: FormulaValues,
): FormulaBatchResult => {
  const nextValues: FormulaValues = { ...values };
  const results: Record<string, FormulaCalculationResult> = {};
  const errors: FormulaError[] = [];

  for (const definition of definitions) {
    const result = calculateFormula(definition.expression, nextValues);

    results[definition.name] = result;

    if (result.errors.length > 0) {
      errors.push(...result.errors);
    }

    if (result.value !== null) {
      nextValues[definition.name] = result.value;
    }
  }

  return {
    values: nextValues,
    results,
    errors,
  };
};
