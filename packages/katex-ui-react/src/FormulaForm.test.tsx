// @vitest-environment happy-dom
import React from 'react';
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { FormulaForm } from './FormulaForm.js';

declare global {
  var IS_REACT_ACT_ENVIRONMENT: boolean | undefined;
}

const mockForm = vi.hoisted(() => ({
  setValue: vi.fn(),
  values: {} as Record<string, unknown>,
}));

vi.mock('pdyform-react', () => ({
  FormElementRenderer: ({
    elements,
  }: {
    elements: Array<{ name: string }>;
  }) => (
    <div data-testid="fields">
      {elements.map((element) => (
        <span key={element.name}>{element.name}</span>
      ))}
    </div>
  ),
  useForm: vi.fn(() => ({
    setValue: mockForm.setValue,
    state: {
      values: mockForm.values,
    },
  })),
}));

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

afterEach(() => {
  mockForm.setValue.mockReset();
  mockForm.values = {};
  document.body.innerHTML = '';
});

describe('FormulaForm', () => {
  it('renders fields, initializes values, and reports calculation results', async () => {
    mockForm.values = {
      count: 3,
      price: 10,
    };

    const container = document.createElement('div');
    document.body.append(container);
    const root = createRoot(container);
    const onPdyformSchema = vi.fn();
    const onResult = vi.fn();
    const onValuesChange = vi.fn();

    await act(async () => {
      root.render(
        <FormulaForm
          schema={{
            expression: 'price * count',
            fields: [
              {
                name: 'price',
                label: 'Price',
                defaultValue: 10,
              },
              {
                name: 'count',
                label: 'Count',
                defaultValue: 3,
              },
            ],
            result: {
              label: 'Total',
              precision: 12,
            },
          }}
          initialValues={{
            count: 3,
            price: 10,
          }}
          onPdyformSchema={onPdyformSchema}
          onResult={onResult}
          onValuesChange={onValuesChange}
          showResult
        />,
      );
    });

    expect(container.textContent).toContain('price');
    expect(container.textContent).toContain('count');
    expect(container.textContent).toContain('Total');
    expect(container.textContent).toContain('30');
    expect(mockForm.setValue).toHaveBeenCalledWith('count', 3);
    expect(mockForm.setValue).toHaveBeenCalledWith('price', 10);
    expect(onPdyformSchema).toHaveBeenCalledWith(
      expect.objectContaining({
        fields: expect.arrayContaining([
          expect.objectContaining({
            name: 'price',
          }),
          expect.objectContaining({
            name: 'count',
          }),
        ]),
      }),
    );
    expect(onValuesChange).toHaveBeenCalledWith({
      count: 3,
      price: 10,
    });
    expect(onResult).toHaveBeenCalledWith({
      value: 30,
      errors: [],
    });

    await act(async () => {
      root.unmount();
    });
  });
});
