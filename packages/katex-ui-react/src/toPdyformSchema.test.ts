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
      ],
      submitButtonText: 'Calculate',
    });
  });
});
