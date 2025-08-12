import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: [
      'tests/unit/**/*.test.ts',
      'tests/components/**/*.spec.ts',
      'tests/api/**/*.spec.ts',
      'tests/lib/**/*.spec.ts'
    ],
    exclude: [
      'tests/**/*.e2e.spec.ts',
      'tests/components/landing/**/*.spec.ts', // Esclude i test Playwright
      'tests/email-themes.spec.ts' // Esclude il test E2E dei temi
    ],
    setupFiles: ['./tests/setup.ts'],
    transformMode: {
      web: [/\.[jt]sx?$/],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
})
