import type { JestConfigWithTsJest } from 'ts-jest';
import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';

const jestConfig: JestConfigWithTsJest = {
  testEnvironment: 'jsdom',
  preset: 'ts-jest',
  transform: {
    '^.+\\.ts(x)?$': [
      'ts-jest',
      {
        // ts-jest configuration goes here
      },
    ],
  },
  collectCoverage: true,
  collectCoverageFrom: ['src/utils'], // Re-enable and add paths when we have non-component unit testing to do.
  coverageReporters: [['lcov', { projectRoot: '..' }]],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  snapshotResolver: './tests/snapshotResolver.ts',
  randomize: true, // Randomizes order of tests
  roots: ['.'],
  modulePaths: [compilerOptions.baseUrl], // <-- This will be set to 'baseUrl' value
  moduleNameMapper: {
    // FIXME: The mapper matches the first occurrence, so image and css files are not getting matched properly.
    ...pathsToModuleNameMapper(compilerOptions.paths),
    '\\.(svg|png)$': '<rootDir>/tests/__mocks__/imgMock.tsx',
    '\\.(css|less)$': '<rootDir>/tests/__mocks__/styleMock.ts',
  },
  setupFilesAfterEnv: ['./tests/setupTests.ts'],
  prettierPath: null,
};

export default jestConfig;
