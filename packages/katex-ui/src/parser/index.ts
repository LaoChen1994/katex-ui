import {
  calculateFormula,
  createFormulaRunner,
  extractVariables,
  validateFormula,
} from '../core/index.js';
import type {
  FormulaCalculationResult,
  FormulaValues,
} from '../core/index.js';
import { createFormulaSchema } from '../schema/index.js';
import type {
  FormulaField,
  FormulaResultSchema,
  FormulaSchema,
} from '../schema/index.js';

export type FormulaParseErrorCode =
  | 'EMPTY_LATEX'
  | 'INVALID_LATEX'
  | 'INVALID_EXPRESSION';

export type FormulaParseError = {
  code: FormulaParseErrorCode;
  message: string;
};

export type ParsedLatexFormula = {
  source: string;
  expression: string;
  variables: string[];
  errors: FormulaParseError[];
};

export type CreateLatexFormulaSchemaOptions = {
  source: string;
  fields?: FormulaField[];
  result?: FormulaResultSchema;
};

export type LatexFormulaCalculator = ParsedLatexFormula & {
  schema: FormulaSchema;
  calculate: (values: FormulaValues) => FormulaCalculationResult;
};

const commandMap: Record<string, string> = {
  '\\abs': 'abs',
  '\\cdot': '*',
  '\\cos': 'cos',
  '\\div': '/',
  '\\left': '',
  '\\log': 'log',
  '\\max': 'max',
  '\\min': 'min',
  '\\operatorname{abs}': 'abs',
  '\\operatorname{cos}': 'cos',
  '\\operatorname{log}': 'log',
  '\\operatorname{max}': 'max',
  '\\operatorname{min}': 'min',
  '\\operatorname{round}': 'round',
  '\\operatorname{sin}': 'sin',
  '\\operatorname{tan}': 'tan',
  '\\right': '',
  '\\round': 'round',
  '\\sin': 'sin',
  '\\tan': 'tan',
  '\\times': '*',
};

const hasBalancedBraces = (source: string): boolean => {
  let depth = 0;

  for (const char of source) {
    if (char === '{') {
      depth += 1;
    }

    if (char === '}') {
      depth -= 1;

      if (depth < 0) {
        return false;
      }
    }
  }

  return depth === 0;
};

const readBracedGroup = (
  source: string,
  startIndex: number,
): { content: string; endIndex: number } | null => {
  if (source[startIndex] !== '{') {
    return null;
  }

  let depth = 0;

  for (let index = startIndex; index < source.length; index += 1) {
    const char = source[index];

    if (char === '{') {
      depth += 1;
    }

    if (char === '}') {
      depth -= 1;

      if (depth === 0) {
        return {
          content: source.slice(startIndex + 1, index),
          endIndex: index + 1,
        };
      }
    }
  }

  return null;
};

const replaceLatexCommand = (
  source: string,
  command: string,
  mapper: (
    firstGroup: string,
    secondGroup: string | undefined,
  ) => string,
): string | null => {
  let result = '';
  let index = 0;

  while (index < source.length) {
    if (!source.startsWith(command, index)) {
      result += source[index];
      index += 1;
      continue;
    }

    const firstGroup = readBracedGroup(source, index + command.length);

    if (!firstGroup) {
      return null;
    }

    const secondGroup = readBracedGroup(source, firstGroup.endIndex);

    result += mapper(firstGroup.content, secondGroup?.content);
    index = secondGroup?.endIndex ?? firstGroup.endIndex;
  }

  return result;
};

const replacePowerGroups = (source: string): string | null => {
  let result = '';
  let index = 0;

  while (index < source.length) {
    if (source[index] !== '^' || source[index + 1] !== '{') {
      result += source[index];
      index += 1;
      continue;
    }

    const group = readBracedGroup(source, index + 1);

    if (!group) {
      return null;
    }

    result += `^(${latexToExpression(group.content)})`;
    index = group.endIndex;
  }

  return result;
};

export const latexToExpression = (source: string): string => {
  let expression = source.trim();

  if (!hasBalancedBraces(expression)) {
    return '';
  }

  const fractionExpression = replaceLatexCommand(
    expression,
    '\\frac',
    (numerator, denominator) => {
      if (denominator === undefined) {
        return '';
      }

      return `((${latexToExpression(numerator)}) / (${latexToExpression(denominator)}))`;
    },
  );

  if (fractionExpression === null) {
    return '';
  }

  expression = fractionExpression;

  const sqrtExpression = replaceLatexCommand(expression, '\\sqrt', (value) => {
    return `sqrt(${latexToExpression(value)})`;
  });

  if (sqrtExpression === null) {
    return '';
  }

  expression = sqrtExpression;

  const powerExpression = replacePowerGroups(expression);

  if (powerExpression === null) {
    return '';
  }

  expression = powerExpression;

  for (const [command, replacement] of Object.entries(commandMap)) {
    expression = expression.split(command).join(replacement);
  }

  if (/\\[a-zA-Z]+/.test(expression)) {
    return '';
  }

  return expression
    .replaceAll('{', '(')
    .replaceAll('}', ')')
    .replaceAll('\\', '')
    .replace(/\s+/g, ' ')
    .trim();
};

export const parseLatexFormula = (source: string): ParsedLatexFormula => {
  if (!source.trim()) {
    return {
      source,
      expression: '',
      variables: [],
      errors: [
        {
          code: 'EMPTY_LATEX',
          message: 'LaTeX formula is required.',
        },
      ],
    };
  }

  const expression = latexToExpression(source);

  if (!expression) {
    return {
      source,
      expression,
      variables: [],
      errors: [
        {
          code: 'INVALID_LATEX',
          message: 'LaTeX formula is invalid or unsupported.',
        },
      ],
    };
  }

  const validation = validateFormula(expression);

  return {
    source,
    expression,
    variables: validation.valid ? extractVariables(expression) : [],
    errors: validation.errors.map((error) => ({
      code: 'INVALID_EXPRESSION',
      message: error.message,
    })),
  };
};

export const calculateLatexFormula = (
  source: string,
  values: FormulaValues,
): FormulaCalculationResult => {
  const parsed = parseLatexFormula(source);

  if (parsed.errors.length > 0) {
    return {
      value: null,
      errors: parsed.errors.map((error) => ({
        code: 'INVALID_EXPRESSION',
        message: error.message,
      })),
    };
  }

  return calculateFormula(parsed.expression, values);
};

export const createLatexFormulaSchema = (
  sourceOrOptions: string | CreateLatexFormulaSchemaOptions,
  fields: FormulaField[] = [],
): FormulaSchema => {
  const source =
    typeof sourceOrOptions === 'string'
      ? sourceOrOptions
      : sourceOrOptions.source;
  const parsed = parseLatexFormula(source);

  return createFormulaSchema({
    expression: parsed.expression,
    fields:
      typeof sourceOrOptions === 'string'
        ? fields
        : sourceOrOptions.fields ?? [],
    result:
      typeof sourceOrOptions === 'string'
        ? undefined
        : sourceOrOptions.result,
  });
};

export const createLatexFormulaCalculator = (
  options: CreateLatexFormulaSchemaOptions,
): LatexFormulaCalculator => {
  const parsed = parseLatexFormula(options.source);
  const schema = createFormulaSchema({
    expression: parsed.expression,
    fields: options.fields ?? [],
    result: options.result,
  });
  const runner = createFormulaRunner(parsed.expression);

  return {
    ...parsed,
    schema,
    calculate: (values) => {
      if (parsed.errors.length > 0) {
        return {
          value: null,
          errors: parsed.errors.map((error) => ({
            code: 'INVALID_EXPRESSION',
            message: error.message,
          })),
        };
      }

      return runner.calculate(values);
    },
  };
};
