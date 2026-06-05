# katex-ui-vue

[![npm](https://img.shields.io/npm/v/katex-ui-vue?label=npm)](https://www.npmjs.com/package/katex-ui-vue)
[![demo](https://img.shields.io/badge/demo-GitHub%20Pages-2f6fed)](https://laochen1994.github.io/katex-ui/)
[![Vue](https://img.shields.io/badge/Vue-3.5-42b883)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-ready-3178c6)](https://www.typescriptlang.org/)
[![coverage](https://img.shields.io/badge/coverage-75.37%25-7c3aed)](#quality)
[![license](https://img.shields.io/badge/license-MIT-68a063)](https://github.com/LaoChen1994/katex-ui)

Vue renderer for formula-powered calculators built with `katex-ui`.

It turns a framework-neutral `FormulaSchema` into a live Vue form, emits value/result updates, and stays thin: parsing, schema generation, formatting, and calculation remain in `katex-ui`.

It does not render TeX math. Pair it with `katex-ui/parser` when pragmatic LaTeX needs to become a calculator form.

## Install

```bash
pnpm add katex-ui katex-ui-vue vue
```

## Repository

[github.com/LaoChen1994/katex-ui](https://github.com/LaoChen1994/katex-ui)

## Homepage

[laochen1994.github.io/katex-ui/](https://laochen1994.github.io/katex-ui/)

## Highlights

- **Vue 3 adapter** - native `defineComponent` renderer with typed props and emits.
- **Live calculation** - recalculates through `katex-ui/core` whenever values change.
- **Schema-first API** - accepts the same `FormulaSchema` used by React and future renderers.
- **LaTeX-ready workflow** - pair with `createLatexFormulaCalculator` for formula-generated calculators.
- **Serializable config** - render configs produced by `createLatexFormulaCalculatorConfig`.
- **No pdyform dependency** - Vue adapter renders native controls directly.

## Quick Start

```vue
<script setup lang="ts">
import { createLatexFormulaCalculator } from 'katex-ui/parser';
import { FormulaForm } from 'katex-ui-vue';

const calculator = createLatexFormulaCalculator({
  source: '\\frac{price \\times count}{discount}',
  fields: [
    { name: 'price', label: '单价', defaultValue: 100 },
    { name: 'count', label: '数量', defaultValue: 2 },
    { name: 'discount', label: '折扣因子', defaultValue: 4 },
  ],
  result: {
    label: '结果',
    precision: 12,
  },
});
</script>

<template>
  <FormulaForm
    :schema="calculator.schema"
    show-result
    @result="(result) => console.log(result)"
    @values-change="(values) => console.log(values)"
  />
</template>
```

## Quality

- Unit tests: 1 Vue DOM behavior test.
- Coverage: 75.37% statements, 44.44% branches, 78.57% functions.
- Build: `tsup` ESM + `.d.ts`.
- Runtime peers: `vue`.
