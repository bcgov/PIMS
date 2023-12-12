import type { JestConfigWithTsJest } from 'ts-jest';

const jestConfig: JestConfigWithTsJest = {
  testEnvironment: 'node',
  preset: 'ts-jest',
  transform: {
    '^.+\\.ts?$': [
      'ts-jest',
      {
        // ts-jest configuration goes here
      },
    ],
  },
  collectCoverage: true,
  collectCoverageFrom: [
    'controllers/**/*.ts',
    'middleware/**/*.ts',
    'utilities/**/*.ts',
    'routes/**/*.ts',
    'express.ts',
  ],
  coveragePathIgnorePatterns: ['index.ts'],
  coverageReporters: [['lcov', { projectRoot: '..' }]],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    'express.ts': {
      branches: 0, // Because rate limiter is omitted when testing
    },
  },
  randomize: true, // Randomizes order of tests
};

export default jestConfig;
