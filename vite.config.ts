/// <reference types="vitest" />
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      reporter: ['lcov', 'text'],
      include: ['src/**/*.ts'],
      exclude: ['**/node_modules/**', 'env.ts', 'mock.ts', '**/scripts/**'],
    },
    env: {
      NODEENV: 'test',
    },
  },
  plugins: [tsconfigPaths()],
});
