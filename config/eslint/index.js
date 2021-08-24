// This is a workaround for https://github.com/eslint/eslint/issues/3458
require(`@rushstack/eslint-config/patch/modern-module-resolution`);

module.exports = function (dirProject, nodeModulesPath) {
  const fullExtendsPath = nodeModulesPath + '@ricklove/config-eslint/rules.js';
  console.log('Loading eslint', { project: dirProject, extends: fullExtendsPath, actual: __dirname });
  //console.log('Loading eslint', { dirProject, fullExtendsPath, nodeModulesPath, __dirname });
  return {
    extends: [fullExtendsPath],
    parserOptions: { tsconfigRootDir: dirProject },
  };
};
