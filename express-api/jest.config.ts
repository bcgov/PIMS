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
    'routes/**/*.ts',
    'express.ts',
  ],
  coveragePathIgnorePatterns: ['index.ts'],
  coverageReporters: ['lcov'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  randomize: true, // Randomizes order of tests
};

export default jestConfig;
