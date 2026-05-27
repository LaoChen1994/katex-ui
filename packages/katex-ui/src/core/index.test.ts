import { describe, expect, it } from 'vitest';
import {
  calculateFormula,
  calculateFormulaBatch,
  createFormulaRunner,
  extractVariables,
  formatFormulaValue,
  getFormulaSummary,
  validateFormula,
} from './index.js';

describe('core formula utilities', () => {
  it('extracts variables from a formula', () => {
    expect(extractVariables('price * count * discount')).toEqual([
      'price',
      'count',
      'discount',
    ]);
  });

  it('returns no variables for empty or invalid expressions', () => {
    expect(extractVariables('')).toEqual([]);
    expect(extractVariables('price *')).toEqual([]);
  });

  it('validates invalid expressions', () => {
    expect(validateFormula('price *').valid).toBe(false);
  });

  it('validates empty expressions', () => {
    expect(validateFormula('')).toEqual({
      valid: false,
      errors: [
        {
          code: 'INVALID_EXPRESSION',
          message: 'Formula expression is required.',
        },
      ],
    });
  });

  it('calculates a numeric formula', () => {
    expect(
      calculateFormula('price * count', {
        price: 10,
        count: 3,
      }),
    ).toEqual({
      value: 30,
      errors: [],
    });
  });

  it('calculates formulas with functions and parentheses', () => {
    expect(
      calculateFormula('round(max(price, floor(base * rate)))', {
        price: 10.2,
        base: 8,
        rate: 1.5,
      }),
    ).toEqual({
      value: 12,
      errors: [],
    });
  });

  it('converts booleans to numeric values during calculation', () => {
    expect(
      calculateFormula('enabled * price', {
        enabled: true,
        price: 10,
      }),
    ).toEqual({
      value: 10,
      errors: [],
    });

    expect(
      calculateFormula('enabled * price', {
        enabled: false,
        price: 10,
      }),
    ).toEqual({
      value: 0,
      errors: [],
    });
  });

  it('returns invalid result errors for non-finite results', () => {
    expect(calculateFormula('price / count', { price: 10, count: 0 })).toEqual({
      value: null,
      errors: [
        {
          code: 'INVALID_RESULT',
          message: 'Formula result must be a finite number.',
        },
      ],
    });
  });

  it('returns invalid expression errors for invalid formulas', () => {
    const result = calculateFormula('price *', { price: 10 });

    expect(result.value).toBeNull();
    expect(result.errors[0]?.code).toBe('INVALID_EXPRESSION');
  });

  it('treats unresolved function names as missing variables', () => {
    expect(calculateFormula('unknownFn(price)', { price: 10 })).toEqual({
      value: null,
      errors: [
        {
          code: 'MISSING_VARIABLE',
          message: 'Variable "unknownFn" is required.',
          variable: 'unknownFn',
        },
      ],
    });
  });

  it('returns missing variable errors', () => {
    expect(calculateFormula('price * count', { price: 10 })).toEqual({
      value: null,
      errors: [
        {
          code: 'MISSING_VARIABLE',
          message: 'Variable "count" is required.',
          variable: 'count',
        },
      ],
    });
  });

  it('treats empty strings as missing values', () => {
    expect(calculateFormula('price * count', { price: 10, count: '' })).toEqual({
      value: null,
      errors: [
        {
          code: 'MISSING_VARIABLE',
          message: 'Variable "count" is required.',
          variable: 'count',
        },
      ],
    });
  });

  it('formats floating point values for display', () => {
    expect(formatFormulaValue(237.60000000000002, { precision: 12 })).toBe(
      '237.6',
    );
    expect(
      formatFormulaValue(1234.5, {
        locale: 'en-US',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    ).toBe('1,234.50');
    expect(formatFormulaValue(null, { fallback: 'N/A' })).toBe('N/A');
  });

  it('summarizes formula validity and variables', () => {
    expect(getFormulaSummary('price * count')).toEqual({
      expression: 'price * count',
      variables: ['price', 'count'],
      valid: true,
      errors: [],
    });

    expect(getFormulaSummary('price *')).toEqual({
      expression: 'price *',
      variables: [],
      valid: false,
      errors: [
        {
          code: 'INVALID_EXPRESSION',
          message: 'unexpected TEOF: EOF',
        },
      ],
    });
  });

  it('creates a reusable formula runner', () => {
    const runner = createFormulaRunner('price * count');

    expect(runner.expression).toBe('price * count');
    expect(runner.variables).toEqual(['price', 'count']);
    expect(runner.calculate({ price: 12, count: 4 })).toEqual({
      value: 48,
      errors: [],
    });
  });

  it('keeps invalid formula runners safe to call', () => {
    const runner = createFormulaRunner('price *');

    expect(runner.variables).toEqual([]);
    expect(runner.calculate({ price: 12 }).value).toBeNull();
    expect(runner.calculate({ price: 12 }).errors[0]?.code).toBe(
      'INVALID_EXPRESSION',
    );
  });

  it('calculates formula batches with derived values', () => {
    expect(
      calculateFormulaBatch(
        [
          { name: 'subtotal', expression: 'price * count' },
          { name: 'tax', expression: 'subtotal * taxRate' },
          { name: 'total', expression: 'subtotal + tax' },
        ],
        {
          price: 100,
          count: 2,
          taxRate: 0.06,
        },
      ),
    ).toEqual({
      values: {
        price: 100,
        count: 2,
        taxRate: 0.06,
        subtotal: 200,
        tax: 12,
        total: 212,
      },
      results: {
        subtotal: {
          value: 200,
          errors: [],
        },
        tax: {
          value: 12,
          errors: [],
        },
        total: {
          value: 212,
          errors: [],
        },
      },
      errors: [],
    });
  });

  it('keeps batch errors and continues with later definitions', () => {
    expect(
      calculateFormulaBatch(
        [
          { name: 'subtotal', expression: 'price * count' },
          { name: 'fee', expression: 'price + 10' },
        ],
        {
          price: 100,
        },
      ),
    ).toEqual({
      values: {
        price: 100,
        fee: 110,
      },
      results: {
        subtotal: {
          value: null,
          errors: [
            {
              code: 'MISSING_VARIABLE',
              message: 'Variable "count" is required.',
              variable: 'count',
            },
          ],
        },
        fee: {
          value: 110,
          errors: [],
        },
      },
      errors: [
        {
          code: 'MISSING_VARIABLE',
          message: 'Variable "count" is required.',
          variable: 'count',
        },
      ],
    });
  });
});
