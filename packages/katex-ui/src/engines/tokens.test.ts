import { describe, expect, it } from 'vitest';
import { tokenizeArithmeticExpression } from './tokens.js';

describe('tokenizeArithmeticExpression', () => {
  it('tokenizes arithmetic expressions', () => {
    expect(
      tokenizeArithmeticExpression('round(price * 2.5, tax_rate)'),
    ).toEqual([
      { type: 'identifier', value: 'round' },
      { type: 'paren', value: '(' },
      { type: 'identifier', value: 'price' },
      { type: 'operator', value: '*' },
      { type: 'number', value: '2.5' },
      { type: 'comma', value: ',' },
      { type: 'identifier', value: 'tax_rate' },
      { type: 'paren', value: ')' },
      { type: 'eof', value: '' },
    ]);
  });

  it('rejects unsupported characters', () => {
    expect(() => tokenizeArithmeticExpression('price > count')).toThrow(
      'Unexpected token ">".',
    );
  });
});
