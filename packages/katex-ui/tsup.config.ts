import { defineConfig } from 'tsup';

export default defineConfig({
  clean: true,
  dts: true,
  entry: ['src/index.ts', 'src/core/index.ts', 'src/schema/index.ts'],
  format: ['esm'],
  sourcemap: true,
});
