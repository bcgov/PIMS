import type { JestConfigWithTsJest } from 'ts-jest';
import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';

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
    'src/controllers/**/*.ts',
    'src/middleware/**/*.ts',
    'src/utilities/**/*.ts',
    'src/routes/**/*.ts',
    'src/services/**/*.ts',
    'src/express.ts',
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
    'src/express.ts': {
      branches: 0, // Because rate limiter is omitted when testing
    },
  },
  randomize: true, // Randomizes order of tests
  roots: ['.'],
  modulePaths: [compilerOptions.baseUrl], // <-- This will be set to 'baseUrl' value
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
  setupFiles: ['dotenv/config'],
};

export default jestConfig;
