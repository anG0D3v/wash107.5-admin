/* eslint-env node */
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:react-hooks/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: true,
    tsconfigRootDir: __dirname,
  },
  plugins: [
    'react-refresh',
    '@typescript-eslint',
    'eslint-plugin-no-inline-styles',
    'jest',
  ],
  rules: {
    'no-inline-styles/no-inline-styles': 'error',
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-unsafe-member-access': 0,
    '@typescript-eslint/no-unsafe-assignment': 0,
    '@typescript-eslint/no-floating-promises': [
      'off',
      {
        ignoreIIFE: false,
      },
    ],
    '@typescript-eslint/no-unsafe-call': 0,
    '@typescript-eslint/no-misused-promises': [
      'error',
      {
        checksVoidReturn: false,
      },
    ],
    'require-await': 'off',
    '@typescript-eslint/require-await': 0,
    '@typescript-eslint/restrict-template-expressions': 0,
  },

  ignorePatterns: [
    'tailwind.config.js',
    'node_modules/',
    'build/',
    'vite.config.js',
  ],
};
