import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      'chapter-1': path.resolve('./src/chapter-1'),
      'chapter-2': path.resolve('./src/chapter-2'),
      'chapter-3': path.resolve('./src/chapter-3'),
      'chapter-4': path.resolve('./src/chapter-4'),
      'chapter-5': path.resolve('./src/chapter-5'),
    },
  },
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'text-summary', 'html', 'lcov'],
      include: ['src/**/*.js'],
      exclude: ['node_modules', 'dist', 'demos'],
    },
  },
})
