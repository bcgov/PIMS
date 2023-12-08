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
    '@typescript-eslint/no-duplicate-enum-values': 'warn', // TODO: Review whether we need those duplicate enum values.
  },
  ignorePatterns: ['node_modules/', 'package-lock.json', 'dist/'],
};
