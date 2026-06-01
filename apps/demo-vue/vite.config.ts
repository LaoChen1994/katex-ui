import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      'katex-ui-vue': fileURLToPath(
        new URL('../../packages/katex-ui-vue/src/index.ts', import.meta.url),
      ),
      'katex-ui/core': fileURLToPath(
        new URL('../../packages/katex-ui/src/core/index.ts', import.meta.url),
      ),
      'katex-ui/parser': fileURLToPath(
        new URL('../../packages/katex-ui/src/parser/index.ts', import.meta.url),
      ),
      'katex-ui/schema': fileURLToPath(
        new URL('../../packages/katex-ui/src/schema/index.ts', import.meta.url),
      ),
      'katex-ui': fileURLToPath(
        new URL('../../packages/katex-ui/src/index.ts', import.meta.url),
      ),
    },
  },
});
