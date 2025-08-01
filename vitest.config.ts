/// <reference types="vitest" />

import path from 'node:path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'lib'),
    },
  },
  test: {
    globals: true,
    coverage: {
      include: ['lib'],
    },
  },
})
