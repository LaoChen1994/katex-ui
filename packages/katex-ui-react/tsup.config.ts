import { defineConfig } from 'tsup';

export default defineConfig({
  clean: true,
  dts: true,
  entry: ['src/index.ts'],
  external: ['katex-ui', 'pdyform-core', 'pdyform-react', 'react', 'react-dom'],
  format: ['esm'],
  sourcemap: true,
});
