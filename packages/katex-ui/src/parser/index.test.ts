import { describe, expect, it } from 'vitest';
import {
  calculateLatexFormula,
  latexToExpression,
  parseLatexFormula,
} from './index.js';

describe('latex parser utilities', () => {
  it('converts common latex operators to calculation expressions', () => {
    expect(latexToExpression('price \\times count \\cdot discount')).toBe(
      'price * count * discount',
    );
    expect(latexToExpression('amount \\div count')).toBe('amount / count');
  });

  it('converts fractions', () => {
    expect(latexToExpression('\\frac{price \\times count}{discount}')).toBe(
      '((price * count) / (discount))',
    );
  });

  it('converts nested fractions', () => {
    expect(latexToExpression('\\frac{\\frac{a}{b}}{c}')).toBe(
      '((((a) / (b))) / (c))',
    );
  });

  it('converts square roots', () => {
    expect(latexToExpression('\\sqrt{price + tax}')).toBe('sqrt(price + tax)');
  });

  it('converts braced powers', () => {
    expect(latexToExpression('x^{2} + y^3')).toBe('x^(2) + y^3');
  });

  it('converts supported latex functions', () => {
    expect(latexToExpression('\\max(price, floor) + \\min(a, b)')).toBe(
      'max(price, floor) + min(a, b)',
    );
  });

  it('parses latex formulas into expressions and variables', () => {
    expect(parseLatexFormula('\\frac{price \\times count}{discount}')).toEqual({
      source: '\\frac{price \\times count}{discount}',
      expression: '((price * count) / (discount))',
      variables: ['price', 'count', 'discount'],
      errors: [],
    });
  });

  it('returns empty latex errors', () => {
    expect(parseLatexFormula('')).toEqual({
      source: '',
      expression: '',
      variables: [],
      errors: [
        {
          code: 'EMPTY_LATEX',
          message: 'LaTeX formula is required.',
        },
      ],
    });
  });

  it('returns invalid latex errors for broken groups', () => {
    expect(parseLatexFormula('\\frac{price}{count')).toEqual({
      source: '\\frac{price}{count',
      expression: '',
      variables: [],
      errors: [
        {
          code: 'INVALID_LATEX',
          message: 'LaTeX formula is invalid or unsupported.',
        },
      ],
    });
  });

  it('calculates latex formulas through the core calculator', () => {
    expect(
      calculateLatexFormula('\\frac{price \\times count}{discount}', {
        price: 100,
        count: 2,
        discount: 4,
      }),
    ).toEqual({
      value: 50,
      errors: [],
    });
  });

  it('returns core calculation errors for missing latex variables', () => {
    expect(
      calculateLatexFormula('\\frac{price \\times count}{discount}', {
        price: 100,
        count: 2,
      }),
    ).toEqual({
      value: null,
      errors: [
        {
          code: 'MISSING_VARIABLE',
          message: 'Variable "discount" is required.',
          variable: 'discount',
        },
      ],
    });
  });
});
