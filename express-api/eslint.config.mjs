import prettierPlugin from 'eslint-plugin-prettier';
import tseslint from 'typescript-eslint';
import eslint from '@eslint/js';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    // Specify the parser for TypeScript
    languageOptions: {
      parser: tseslint.parser,
    },
    plugins: {
      prettier: prettierPlugin,
    },
    // Define your ESLint rules
    rules: {
      'prettier/prettier': 'warn',
      'no-extra-boolean-cast': 'off',
      'no-unsafe-optional-chaining': 'off',
      'no-prototype-builtins': 'off',
      'no-console': 'error', // Use logger instead
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-duplicate-enum-values': 'error',
    },
    // Include these files in linting
    files: ['**/*.ts', '**/*.js'],
  },
  {
    // Ignore specific files and directories. node_modules ignored by default
    ignores: ['package-lock.json', 'dist/', 'coverage/'],
  },
);
