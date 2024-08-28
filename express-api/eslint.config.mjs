import typescriptEslint from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import prettierPlugin from 'eslint-plugin-prettier';

export default {
  // Specify the parser for TypeScript
  languageOptions: {
    parser: typescriptParser,
  },
  plugins: {
    '@typescript-eslint': typescriptEslint,
    prettier: prettierPlugin,
  },
  // Define your ESLint rules
  rules: {
    'prettier/prettier': 'warn',
    'no-extra-boolean-cast': 'off',
    'no-unsafe-optional-chaining': 'off',
    'no-prototype-builtins': 'off',
    'no-console': 'error',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-duplicate-enum-values': 'error',
  },
  // Ignore specific files and directories
  ignores: ['node_modules/', 'package-lock.json', 'dist/', 'coverage/'],
  // Override settings for specific file types
  files: ['**/*.ts', '**/*.js'],
};
