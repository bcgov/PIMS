/*import js from '@eslint/js';
//import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  tseslint.configs.recommended,
  //typescriptEslint,
  prettier,
  {
    languageOptions: {
      global: {
        module: 'readonly',
      },
      sourceType: 'module',
    },
    env: {
      node: true,
    },
    extends: [
      // By extending from a plugin config, we can get recommended rules without having to add them manually.
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      // This disables the formatting rules in ESLint that Prettier is going to be responsible for handling.
      // Make sure it's always the last config, so it gets the chance to override other configs.
      'eslint-config-prettier',
    ],
    plugins: ['prettier'],
    rules: {
      // Override ones from the extended configs.
      'prettier/prettier': 'warn',
      'no-extra-boolean-cast': 'off',
      'no-unsafe-optional-chaining': 'off',
      'no-prototype-builtins': 'off',
      'no-console': 'error',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-inferrable-types': 'off', // ie. const val: number = 4;
      '@typescript-eslint/no-empty-function': 'off', // ie. {}
      '@typescript-eslint/no-non-null-assertion': 'off', // Allow use of non-null assertion operator (!).
      '@typescript-eslint/no-explicit-any': 'warn', // Warn if 'any' type is used.
      '@typescript-eslint/no-duplicate-enum-values': 'error',
    },
    ignores: ['node_modules/', 'package-lock.json', 'dist/', 'coverage/'],
      },
];
*/

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
  // Additional specific rules or settings for these file types can go here if needed
};
