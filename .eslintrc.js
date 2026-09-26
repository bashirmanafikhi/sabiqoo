/* eslint-env node */
module.exports = {
  root: true,
  extends: ['expo', 'plugin:react-native-a11y/all'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  ignorePatterns: ['node_modules/', '.expo/', 'dist/', 'babel.config.js', 'metro.config.js', 'jest.setup.js'],
  rules: {
    'react-native-a11y/has-accessibility-hint': 'warn',
    'react-native-a11y/has-accessibility-props': 'warn',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'no-restricted-syntax': [
      'error',
      {
        selector: "Literal[value=/\\bml-\\d/]",
        message: 'Use ms- (margin-start) for RTL-safe layout instead of ml-'
      },
      {
        selector: "Literal[value=/\\bmr-\\d/]",
        message: 'Use me- (margin-end) for RTL-safe layout instead of mr-'
      },
      {
        selector: "MemberExpression[property.name='text-left']",
        message: 'Use text-start for RTL-safe layout'
      },
      {
        selector: "MemberExpression[property.name='text-right']",
        message: 'Use text-end for RTL-safe layout'
      },
    ],
  },
  overrides: [
    {
      files: ['**/*.test.ts', '**/*.test.tsx', '__tests__/**/*'],
      env: { jest: true },
    },
  ],
};
