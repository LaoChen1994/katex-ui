import { describe, expect, it } from 'vitest';
import {
  calculateLatexFormula,
  createLatexFormulaCalculator,
  createLatexFormulaSchema,
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
    expect(latexToExpression('\\dfrac{amount}{count} + \\tfrac{fee}{rate}')).toBe(
      '((amount) / (count)) + ((fee) / (rate))',
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

  it('converts latex function commands with braced arguments', () => {
    expect(latexToExpression('\\sin{x} + \\cos{y} + \\tan{z}')).toBe(
      'sin(x) + cos(y) + tan(z)',
    );
    expect(latexToExpression('\\log{price} + \\abs{discount}')).toBe(
      'log(price) + abs(discount)',
    );
    expect(latexToExpression('\\ln{amount} + \\exp{rate}')).toBe(
      'log(amount) + exp(rate)',
    );
  });

  it('converts operatorname functions', () => {
    expect(
      latexToExpression(
        '\\operatorname{round}(price) + \\operatorname{sqrt}(a) + \\operatorname{ln}(b)',
      ),
    ).toBe('round(price) + sqrt(a) + log(b)');
  });

  it('converts simple variable subscripts', () => {
    expect(latexToExpression('price_{net} + tax_1')).toBe('price_net + tax_1');
    expect(parseLatexFormula('price_{net} + tax_1')).toEqual({
      source: 'price_{net} + tax_1',
      expression: 'price_net + tax_1',
      variables: ['price_net', 'tax_1'],
      errors: [],
    });
  });

  it('removes latex sizing commands without changing grouping', () => {
    expect(latexToExpression('\\left(price + tax\\right) \\times count')).toBe(
      '(price + tax) * count',
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

  it('returns invalid latex errors for unsupported commands', () => {
    expect(parseLatexFormula('\\foo{price} + count')).toEqual({
      source: '\\foo{price} + count',
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

  it('creates formula schemas from latex formulas', () => {
    expect(
      createLatexFormulaSchema({
        source: '\\frac{price \\times count}{discount}',
        fields: [
          {
            name: 'price',
            label: '单价',
            defaultValue: 100,
            min: 0,
          },
        ],
        result: {
          label: '结果',
          precision: 12,
        },
      }),
    ).toEqual({
      expression: '((price * count) / (discount))',
      fields: [
        {
          name: 'price',
          label: '单价',
          valueType: 'number',
          required: true,
          defaultValue: 100,
          min: 0,
        },
        {
          name: 'count',
          label: 'count',
          valueType: 'number',
          required: true,
        },
        {
          name: 'discount',
          label: 'discount',
          valueType: 'number',
          required: true,
        },
      ],
      result: {
        label: '结果',
        precision: 12,
      },
    });
  });

  it('creates reusable latex formula calculators', () => {
    const calculator = createLatexFormulaCalculator({
      source: '\\frac{price \\times count}{discount}',
      fields: [
        { name: 'price', label: '单价', defaultValue: 100 },
        { name: 'count', label: '数量', defaultValue: 2 },
        { name: 'discount', label: '折扣', defaultValue: 4 },
      ],
      result: {
        label: '结果',
      },
    });

    expect(calculator.expression).toBe('((price * count) / (discount))');
    expect(calculator.variables).toEqual(['price', 'count', 'discount']);
    expect(calculator.schema.fields.map((field) => field.name)).toEqual([
      'price',
      'count',
      'discount',
    ]);
    expect(
      calculator.calculate({
        price: 100,
        count: 2,
        discount: 4,
      }),
    ).toEqual({
      value: 50,
      errors: [],
    });
  });

  it('keeps invalid latex calculators safe to call', () => {
    const calculator = createLatexFormulaCalculator({
      source: '\\frac{price}{count',
    });

    expect(calculator.expression).toBe('');
    expect(calculator.variables).toEqual([]);
    expect(calculator.schema).toEqual({
      expression: '',
      fields: [],
    });
    expect(calculator.calculate({ price: 100, count: 2 })).toEqual({
      value: null,
      errors: [
        {
          code: 'INVALID_EXPRESSION',
          message: 'LaTeX formula is invalid or unsupported.',
        },
      ],
    });
  });
});
