import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  cacheDir: '.vite-cache',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.test.{ts,tsx}'],
    setupFiles: './src/test/setup.ts',
    exclude: [
      '.northstar/**',
      'coverage/**',
      'dist/**',
      'e2e/**',
      'node_modules/**',
      'playwright-report/**',
      'test-results/**',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        '.northstar/**',
        'coverage/**',
        'dist/**',
        'e2e/**',
        'node_modules/**',
        'playwright-report/**',
        'src/main.tsx',
        'src/test/**',
        'test-results/**',
        '**/*.test.{ts,tsx}',
        '**/*.config.{ts,tsx}',
        '**/*.d.ts',
      ],
      thresholds: {
        lines: 90,
        branches: 90,
        functions: 90,
        statements: 90,
      },
    },
  },
});
