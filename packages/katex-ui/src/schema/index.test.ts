import { describe, expect, it } from 'vitest';
import {
  createFormulaCalculatorConfig,
  createFormulaSchema,
  mergeFormulaFields,
  normalizeFormulaSchema,
} from './index.js';

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

  it('supports object options and result metadata', () => {
    expect(
      createFormulaSchema({
        expression: 'price * count',
        fields: [
          {
            name: 'price',
            label: '单价',
            min: 0,
            step: 0.01,
            layout: 'horizontal',
            componentProps: {
              autoComplete: 'off',
            },
          },
        ],
        result: {
          label: '总价',
          precision: 12,
          fallback: '-',
        },
      }),
    ).toEqual({
      expression: 'price * count',
      fields: [
        {
          name: 'price',
          label: '单价',
          valueType: 'number',
          required: true,
          min: 0,
          step: 0.01,
          layout: 'horizontal',
          componentProps: {
            autoComplete: 'off',
          },
        },
        {
          name: 'count',
          label: 'count',
          valueType: 'number',
          required: true,
        },
      ],
      result: {
        label: '总价',
        precision: 12,
        fallback: '-',
      },
    });
  });

  it('normalizes an existing schema', () => {
    expect(
      normalizeFormulaSchema({
        expression: 'subtotal + tax',
        fields: [
          {
            name: 'tax',
            label: 'Tax',
            defaultValue: 12,
          },
          {
            name: 'unused',
            label: 'Unused',
          },
        ],
      }),
    ).toEqual({
      expression: 'subtotal + tax',
      fields: [
        {
          name: 'subtotal',
          label: 'subtotal',
          valueType: 'number',
          required: true,
        },
        {
          name: 'tax',
          label: 'Tax',
          valueType: 'number',
          required: true,
          defaultValue: 12,
        },
      ],
    });
  });

  it('merges field metadata into the current formula variable order', () => {
    expect(
      mergeFormulaFields('net + tax', [
        {
          name: 'tax',
          label: 'Tax',
          defaultValue: 12,
        },
        {
          name: 'unused',
          label: 'Unused',
          defaultValue: 99,
        },
      ]),
    ).toEqual([
      {
        name: 'net',
        label: 'net',
        valueType: 'number',
        required: true,
      },
      {
        name: 'tax',
        label: 'Tax',
        valueType: 'number',
        required: true,
        defaultValue: 12,
      },
    ]);
  });

  it('creates serializable calculator configs', () => {
    expect(
      createFormulaCalculatorConfig({
        expression: 'price * count',
        fields: [
          {
            name: 'price',
            label: '单价',
            defaultValue: 10,
          },
        ],
        result: {
          label: '总价',
        },
      }),
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
      result: {
        label: '总价',
      },
    });
  });
});
