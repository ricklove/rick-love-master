// This is a workaround for https://github.com/eslint/eslint/issues/3458
require('@rushstack/eslint-config/patch/modern-module-resolution');

module.exports = {
  extends: ['@rushstack/eslint-config/profile/web-app'],
  parserOptions: { tsconfigRootDir: __dirname },

  // https://github.com/microsoft/rushstack/blob/master/stack/eslint-config/profile/_common.js
  // https://github.com/microsoft/rushstack/blob/master/stack/eslint-plugin
  rules: {
    '@rushstack/typedef-var': 'off',
    '@typescript-eslint/naming-convention': 'off',
  },
};
