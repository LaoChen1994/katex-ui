import { describe, expect, it } from 'vitest';
import { calculateFormula, extractVariables, validateFormula } from './index.js';

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
});
