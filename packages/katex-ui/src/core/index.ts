import { Parser } from 'expr-eval';
import type { Values } from 'expr-eval';

export type FormulaValue = number | string | boolean | null | undefined;

export type FormulaValues = Record<string, FormulaValue>;

export type FormulaErrorCode =
  | 'INVALID_EXPRESSION'
  | 'MISSING_VARIABLE'
  | 'INVALID_RESULT';

export type FormulaError = {
  code: FormulaErrorCode;
  message: string;
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

const parser = new Parser();

export const extractVariables = (expression: string): string[] => {
  if (!expression.trim()) {
    return [];
  }

  try {
    return parser.parse(expression).variables();
  } catch {
    return [];
  }
};

export const validateFormula = (expression: string): FormulaValidationResult => {
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
    parser.parse(expression);
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

export const calculateFormula = (
  expression: string,
  values: FormulaValues,
): FormulaCalculationResult => {
  const validation = validateFormula(expression);

  if (!validation.valid) {
    return {
      value: null,
      errors: validation.errors,
    };
  }

  const missingErrors: FormulaError[] = extractVariables(expression)
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
    const evaluationValues: Values = {};

    for (const variable of extractVariables(expression)) {
      const value = values[variable];

      if (typeof value === 'number' || typeof value === 'string') {
        evaluationValues[variable] = value;
      }

      if (typeof value === 'boolean') {
        evaluationValues[variable] = value ? 1 : 0;
      }
    }

    const result = parser.evaluate(expression, evaluationValues);

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
            error instanceof Error ? error.message : 'Formula calculation failed.',
        },
      ],
    };
  }
};
