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
          { text: 'React', link: '/guide/react' },
          { text: '批量公式', link: '/guide/batch' },
        ],
      },
      {
        text: 'API',
        items: [
          { text: 'Core', link: '/api/core' },
          { text: 'Schema', link: '/api/schema' },
          { text: 'React', link: '/api/react' },
        ],
      },
    ],
  },
});
