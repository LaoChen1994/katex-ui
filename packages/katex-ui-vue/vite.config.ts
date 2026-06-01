import { fileURLToPath, URL } from 'node:url';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: fileURLToPath(new URL('src/index.ts', import.meta.url)),
      fileName: 'index',
      formats: ['es'],
    },
    rollupOptions: {
      external: ['katex-ui', 'katex-ui/core', 'katex-ui/schema', 'vue'],
    },
    sourcemap: true,
  },
});
