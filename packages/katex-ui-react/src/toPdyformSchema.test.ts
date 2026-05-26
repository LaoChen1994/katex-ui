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
          componentProps: {
            inputMode: 'decimal',
          },
          validations: [
            {
              type: 'required',
              message: '单价 is required.',
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
          componentProps: undefined,
          validations: undefined,
        },
      ],
      submitButtonText: 'Calculate',
    });
  });
});
