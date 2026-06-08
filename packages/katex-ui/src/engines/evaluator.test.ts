import { describe, expect, it } from 'vitest';
import { evaluateArithmeticExpression } from './evaluator.js';
import { parseArithmeticExpression } from './parser.js';

describe('evaluateArithmeticExpression', () => {
  it('evaluates parsed expressions', () => {
    const expression = parseArithmeticExpression(
      'round(max(price, floor(base * rate)))',
    );

    expect(
      evaluateArithmeticExpression(expression, {
        price: 10.2,
        base: 8,
        rate: 1.5,
      }),
    ).toBe(12);
  });

  it('converts numeric strings and booleans', () => {
    const expression = parseArithmeticExpression('enabled * price * count');

    expect(
      evaluateArithmeticExpression(expression, {
        count: '3',
        enabled: true,
        price: 10,
      }),
    ).toBe(30);
  });

  it('rejects non-numeric values', () => {
    const expression = parseArithmeticExpression('price * count');

    expect(() =>
      evaluateArithmeticExpression(expression, {
        count: 'abc',
        price: 10,
      }),
    ).toThrow('Variable "count" must be numeric.');
  });
});
