// This is a workaround for https://github.com/eslint/eslint/issues/3458
require(`@rushstack/eslint-config/patch/modern-module-resolution`);

module.exports = function (dirProject) {
  return {
    extends: ['./node_modules/@ricklove/config-eslint/rules.js'],
    parserOptions: { tsconfigRootDir: dirProject },
  };
};
