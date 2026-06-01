// @vitest-environment happy-dom
import { createApp, nextTick } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { FormulaForm } from './FormulaForm.js';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('FormulaForm', () => {
  it('renders fields, emits values, and updates calculation results', async () => {
    const container = document.createElement('div');
    document.body.append(container);
    const onResult = vi.fn();
    const onValuesChange = vi.fn();
    const app = createApp(FormulaForm, {
      schema: {
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
      },
      onResult,
      onValuesChange,
      resultClassName: 'result-bar',
      showResult: true,
    });

    app.mount(container);
    await nextTick();

    expect(container.textContent).toContain('Price');
    expect(container.textContent).toContain('Count');
    expect(container.textContent).toContain('Total');
    expect(container.textContent).toContain('30');
    expect(onValuesChange).toHaveBeenCalledWith({
      count: 3,
      price: 10,
    });
    expect(onResult).toHaveBeenCalledWith({
      value: 30,
      errors: [],
    });

    const priceInput = container.querySelector<HTMLInputElement>('#price');

    if (!priceInput) {
      throw new Error('Expected price input to render.');
    }

    priceInput.value = '12';
    priceInput.dispatchEvent(new InputEvent('input', { bubbles: true }));
    await nextTick();

    expect(container.textContent).toContain('36');
    expect(onValuesChange).toHaveBeenLastCalledWith({
      count: 3,
      price: 12,
    });

    app.unmount();
  });
});
