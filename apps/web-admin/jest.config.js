const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

/** @type {import('jest').Config} */
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: [
    '<rootDir>/src/__tests__/**/*.{test,spec}.{ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{ts,tsx}',
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    // Infrastructure / config files - tested via integration, not unit tests
    '!src/app/layout.tsx',
    '!src/app/not-found.tsx',
    '!src/lib/api.ts',
    '!src/lib/auth.ts',
    '!src/middleware.ts',
    '!src/stores/**',
    // UI primitives - covered by consuming component tests
    '!src/components/ui/dialog.tsx',
    '!src/components/ui/select.tsx',
    '!src/components/ui/table.tsx',
    '!src/components/ui/skeleton.tsx',
    '!src/components/ui/textarea.tsx',
    '!src/components/ui/input.tsx',
    '!src/components/ui/card.tsx',
    '!src/components/ui/badge.tsx',
    // Provider boilerplate
    '!src/components/providers/**',
    // Layout shell components - covered by page-level tests
    '!src/components/layout/**',
    '!src/components/error-boundary.tsx',
    // API hook - requires real HTTP, covered by integration tests
    '!src/hooks/use-api.ts',
    '!src/hooks/index.ts',
    // Dynamic detail pages - rendering tested via list page tests
    '!src/app/**/[id]/**',
    '!src/app/api/**',
  ],
  coverageThreshold: {
    global: {
      branches: 55,
      functions: 60,
      lines: 70,
      statements: 70,
    },
  },
};

module.exports = createJestConfig(customJestConfig);
