import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'bionic-axios',
  description: 'a simple axios reproduction',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' },
    ],
  },
})
