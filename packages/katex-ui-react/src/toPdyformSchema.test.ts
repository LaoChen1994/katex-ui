import { describe, expect, it } from 'vitest';
import { toPdyformSchema } from './toPdyformSchema.js';

describe('toPdyformSchema', () => {
  it('converts formula fields to pdyform fields', () => {
    expect(
      toPdyformSchema({
        expression: 'price * count',
        fields: [
          {
            name: 'price',
            label: '单价',
            valueType: 'number',
            required: true,
            defaultValue: 10,
            min: 0,
            max: 100,
            step: 0.01,
            layout: 'horizontal',
            componentProps: {
              autoComplete: 'off',
            },
          },
          {
            name: 'enabled',
            label: '启用',
            valueType: 'boolean',
          },
          {
            name: 'note',
            label: '备注',
            valueType: 'string',
            placeholder: '填写备注',
            description: '这会渲染成普通文本输入',
          },
          {
            name: 'level',
            label: '等级',
            options: [
              { label: 'A', value: 'a' },
              { label: 'B', value: 'b' },
            ],
          },
        ],
      }),
    ).toEqual({
      fields: [
        {
          id: 'price',
          name: 'price',
          label: '单价',
          type: 'text',
          placeholder: undefined,
          description: undefined,
          defaultValue: 10,
          options: undefined,
          layout: 'horizontal',
          componentProps: {
            inputMode: 'decimal',
            min: 0,
            max: 100,
            step: 0.01,
            autoComplete: 'off',
          },
          validations: [
            {
              type: 'required',
              message: '单价 is required.',
            },
            {
              type: 'min',
              value: 0,
              message: '单价 must be at least 0.',
            },
            {
              type: 'max',
              value: 100,
              message: '单价 must be at most 100.',
            },
          ],
        },
        {
          id: 'enabled',
          name: 'enabled',
          label: '启用',
          type: 'switch',
          placeholder: undefined,
          description: undefined,
          defaultValue: undefined,
          options: undefined,
          layout: undefined,
          componentProps: undefined,
          validations: undefined,
        },
        {
          id: 'note',
          name: 'note',
          label: '备注',
          type: 'text',
          placeholder: '填写备注',
          description: '这会渲染成普通文本输入',
          defaultValue: undefined,
          options: undefined,
          layout: undefined,
          componentProps: undefined,
          validations: undefined,
        },
        {
          id: 'level',
          name: 'level',
          label: '等级',
          type: 'select',
          placeholder: undefined,
          description: undefined,
          defaultValue: undefined,
          options: [
            { label: 'A', value: 'a' },
            { label: 'B', value: 'b' },
          ],
          layout: undefined,
          componentProps: undefined,
          validations: undefined,
        },
      ],
      submitButtonText: 'Calculate',
    });
  });
});
