import { describe, expect, it } from 'vitest';
import { createFormulaSchema } from './index.js';

describe('createFormulaSchema', () => {
  it('creates number fields for formula variables', () => {
    expect(createFormulaSchema('price * count')).toEqual({
      expression: 'price * count',
      fields: [
        {
          name: 'price',
          label: 'price',
          valueType: 'number',
          required: true,
        },
        {
          name: 'count',
          label: 'count',
          valueType: 'number',
          required: true,
        },
      ],
    });
  });

  it('applies configured field metadata', () => {
    expect(
      createFormulaSchema('price * count', [
        {
          name: 'price',
          label: '单价',
          defaultValue: 10,
        },
      ]),
    ).toEqual({
      expression: 'price * count',
      fields: [
        {
          name: 'price',
          label: '单价',
          valueType: 'number',
          required: true,
          defaultValue: 10,
        },
        {
          name: 'count',
          label: 'count',
          valueType: 'number',
          required: true,
        },
      ],
    });
  });
});
