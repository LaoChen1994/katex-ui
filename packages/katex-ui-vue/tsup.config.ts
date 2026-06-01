import { defineConfig } from 'tsup';

export default defineConfig({
  clean: true,
  dts: true,
  entry: ['src/index.ts'],
  external: ['katex-ui', 'vue'],
  format: ['esm'],
  sourcemap: true,
});
