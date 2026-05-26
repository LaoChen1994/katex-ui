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

  it('validates invalid expressions', () => {
    expect(validateFormula('price *').valid).toBe(false);
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
