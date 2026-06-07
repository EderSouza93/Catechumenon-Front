import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    globals: true,
    exclude: ['node_modules/**', '.next/**', 'e2e/**', 'dist/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: [
        'hooks/**/*.{ts,tsx}',
        'services/**/*.ts',
        'utils/**/*.ts',
        'lib/**/*.ts',
        'contexts/**/*.{ts,tsx}',
        'app/api/**/route.ts',
      ],
      exclude: ['**/*.d.ts', '**/__tests__/**', 'types/**'],
    },
    projects: [
      {
        extends: true,
        test: {
          name: 'unit-jsdom',
          environment: 'jsdom',
          environmentOptions: {
            jsdom: { url: 'http://localhost/' },
          },
          setupFiles: ['./vitest.setup.ts'],
          include: [
            'hooks/**/__tests__/**/*.test.{ts,tsx}',
            'services/**/__tests__/*Client.test.ts',
            'contexts/**/__tests__/**/*.test.{ts,tsx}',
            'lib/**/__tests__/**/*.test.ts',
            'utils/**/__tests__/**/*.test.ts',
            'components/**/__tests__/**/*.test.{ts,tsx}',
          ],
        },
      },
      {
        extends: true,
        test: {
          name: 'unit-node',
          environment: 'node',
          setupFiles: ['./vitest.setup.node.ts'],
          include: [
            'services/**/__tests__/*Services.test.ts',
            'services/**/__tests__/api.test.ts',
            'app/api/**/__tests__/**/*.test.ts',
          ],
        },
      },
    ],
  },
});
