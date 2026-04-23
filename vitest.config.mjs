import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    fs: {
      strict: false,
    },
  },
  optimizeDeps: {
    preserveSymlinks: true,
  },
  test: {
    environment: 'jsdom',
    exclude: ['node_modules', 'e2e', 'infrastructure'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/libraries/**/*.ts', 'src/features/**/*.ts'],
      exclude: ['**/*.spec.ts', '**/*.d.ts', '**/index.ts'],
    },
  },
});
