// This is a workaround for https://github.com/eslint/eslint/issues/3458
require('@rushstack/eslint-config/patch/modern-module-resolution');

module.exports = {
  extends: ['@rushstack/eslint-config/profile/web-app'],
  parserOptions: { tsconfigRootDir: __dirname },
  rules: {
    '@rushstack/typedef-var': `off`,
    '@typescript-eslint/naming-convention': `off`,

    // Backticks Everywhere (except jsx and imports)
    quotes: `off`,
    '@typescript-eslint/quotes': [`error`, `backtick`],
    'jsx-quotes': [`error`, `prefer-single`],
    'import-quotes/import-quotes': [`error`, `single`],
  },
};
