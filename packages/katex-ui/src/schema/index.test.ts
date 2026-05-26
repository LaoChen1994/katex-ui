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

  it('ignores configured fields that are not used by the formula', () => {
    expect(
      createFormulaSchema('price * count', [
        {
          name: 'discount',
          label: '折扣',
          defaultValue: 0.8,
        },
      ]),
    ).toEqual({
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

  it('keeps configured field types and options', () => {
    expect(
      createFormulaSchema('price * enabled', [
        {
          name: 'price',
          valueType: 'string',
          required: false,
        },
        {
          name: 'enabled',
          label: '启用',
          valueType: 'boolean',
          defaultValue: true,
        },
      ]),
    ).toEqual({
      expression: 'price * enabled',
      fields: [
        {
          name: 'price',
          label: 'price',
          valueType: 'string',
          required: false,
        },
        {
          name: 'enabled',
          label: '启用',
          valueType: 'boolean',
          required: true,
          defaultValue: true,
        },
      ],
    });
  });
});
