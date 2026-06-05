import { defineConfig } from 'vitepress';

export default defineConfig({
  base: '/katex-ui/',
  title: 'katex-ui',
  description: 'Formula-driven dynamic form toolkit',
  themeConfig: {
    nav: [
      { text: '指南', link: '/guide/getting-started' },
      { text: 'API', link: '/api/core' },
    ],
    sidebar: [
      {
        text: '指南',
        items: [
          { text: '快速开始', link: '/guide/getting-started' },
          { text: 'LaTeX 支持范围', link: '/guide/latex-support' },
          { text: 'React', link: '/guide/react' },
          { text: '批量公式', link: '/guide/batch' },
        ],
      },
      {
        text: 'API',
        items: [
          { text: 'Core', link: '/api/core' },
          { text: 'Parser', link: '/api/parser' },
          { text: 'Schema', link: '/api/schema' },
          { text: 'Config', link: '/api/config' },
          { text: 'React', link: '/api/react' },
          { text: 'Vue', link: '/api/vue' },
        ],
      },
    ],
  },
});
