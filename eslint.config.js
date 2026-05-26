import tseslint from 'typescript-eslint';

export default [
  {
    ignores: ['**/dist/**', '**/.vitepress/dist/**', 'node_modules/**'],
  },
  ...tseslint.configs.recommended,
];
