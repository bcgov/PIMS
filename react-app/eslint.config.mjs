import prettierPlugin from 'eslint-plugin-prettier';
import tseslint from 'typescript-eslint';
import eslint from '@eslint/js';
import reactPlugin from 'react-plugin';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    // Specify the parser for TypeScript
    languageOptions: {
      parser: tseslint.parser,
    },
    plugins: {
      'typescript-eslint': tseslint,
      prettier: prettierPlugin,
      react: reactPlugin,
    },
    settings: {
      react: {
        // Tells eslint-plugin-react to automatically detect the version of React to use.
        version: 'detect',
      },
      // Tells eslint how to resolve imports.
      'import/resolver': {
        node: {
          paths: ['src'],
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },
    rules: {
      // Override ones from the extended configs.
      'prettier/prettier': 'warn',
      'no-extra-boolean-cast': 'off',
      'no-unsafe-optional-chaining': 'off',
      'no-prototype-builtins': 'off',
      'react/prop-types': 'off',
      'react/display-name': 'off',
      'no-console': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-inferrable-types': 'off', // ie. const val: number = 4;
      '@typescript-eslint/no-empty-function': 'off', // ie. {}
      '@typescript-eslint/no-non-null-assertion': 'off', // Allow use of non-null assertion operator (!).
      '@typescript-eslint/no-explicit-any': 'off', // Warn if 'any' type is used.
      '@typescript-eslint/no-duplicate-enum-values': 'error',
      '@typescript-eslint/no-restricted-types': 'error',
    },

    // Override settings for specific file types
    files: ['**/*.ts', '**/*.js', '**/*.tsx', '**/*.jsx'],
  },
  {
    // Ignore specific files and directories
    ignores: ['node_modules/', 'package-lock.json', 'dist/', '/coverage'],
  },
);
