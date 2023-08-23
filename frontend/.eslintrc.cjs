module.exports = {
  globals: {
    module: 'readonly',
  },
  env: {
    node: true,
  },
  extends: [
    // By extending from a plugin config, we can get recommended rules without having to add them manually.
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    // This disables the formatting rules in ESLint that Prettier is going to be responsible for handling.
    // Make sure it's always the last config, so it gets the chance to override other configs.
    'eslint-config-prettier',
  ],
  plugins: ['simple-import-sort', 'prettier'],
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
    'simple-import-sort/imports': 'warn',
    'simple-import-sort/exports': 'warn',
    'prettier/prettier': 'warn',
    'no-extra-boolean-cast': 'off',
    'no-unsafe-optional-chaining': 'off',
    'no-prototype-builtins': 'off',
    'react/no-unescaped-entities': 'off',
    'react/prop-types': 'off',
    'react/display-name': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-inferrable-types': 'off', // ie. const val: number = 4;
    '@typescript-eslint/no-empty-function': 'off', // ie. {}
    '@typescript-eslint/no-non-null-assertion': 'off', // Allow use of non-null assertion operator (!).
    '@typescript-eslint/no-explicit-any': 'off', // Warn if 'any' type is used.
    '@typescript-eslint/no-duplicate-enum-values': 'warn', // TODO: Review whether we need those duplicate enum values.
    '@typescript-eslint/ban-types': [
      'error',
      {
        types: {
          Function: false, // Allow use of the 'Function' type.
        },
        extendDefaults: true,
      },
    ],
  },
  ignorePatterns: ['node_modules/', 'package-lock.json', 'build/', 'dist/'],
};
