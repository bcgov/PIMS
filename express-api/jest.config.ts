import type { JestConfigWithTsJest } from 'ts-jest';

const jestConfig: JestConfigWithTsJest = {
  testEnvironment: 'node',
  preset: 'ts-jest',
  transform: {
    '^.+\\.ts?$': [
      'ts-jest',
      {
        // ts-jest configuration goes here
        tsconfig: {
          baseUrl: "src",
          paths: {
            "@constants/*": ["src/constants/*"],
            "@controllers/*": ["src/controllers/*"],
            "@middleware/*": ["src/middleware/*"],
            "@routes/*": ["src/routes/*"],
            "@swagger/*": ["src/swagger/*"],
            "@typeorm/*": ["src/typeorm/*"],
            "@utilities/*": ["src/utilities/*"],
            "@*": ["src/*"] // Include a wildcard path for general source files
          },


        }
      },
    ],
  },
  collectCoverage: true,
  collectCoverageFrom: [
    'src/controllers/**/*.ts',
    'src/middleware/**/*.ts',
    'src/utilities/**/*.ts',
    'src/routes/**/*.ts',
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
    'express.ts': {
      branches: 0, // Because rate limiter is omitted when testing
    },
  },
  randomize: true, // Randomizes order of tests
};

export default jestConfig;
