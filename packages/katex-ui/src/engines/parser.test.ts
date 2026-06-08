import { describe, expect, it } from 'vitest';
import { parseArithmeticExpression } from './parser.js';

describe('parseArithmeticExpression', () => {
  it('parses expressions and collects usage', () => {
    const expression = parseArithmeticExpression(
      'round(max(price, floor(base * rate)))',
    );

    expect(expression.functions).toEqual(['round', 'max', 'floor']);
    expect(expression.variables).toEqual(['price', 'base', 'rate']);
    expect(expression.node.type).toBe('CallExpression');
  });

  it('keeps unknown calls visible as functions and variables', () => {
    expect(parseArithmeticExpression('unknownFn(price)').functions).toEqual([
      'unknownFn',
    ]);
    expect(parseArithmeticExpression('unknownFn(price)').variables).toEqual([
      'unknownFn',
      'price',
    ]);
  });

  it('rejects trailing input', () => {
    expect(() => parseArithmeticExpression('price count')).toThrow(
      'Formula expression has unexpected trailing input.',
    );
  });
});
