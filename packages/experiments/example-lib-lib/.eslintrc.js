require('@ricklove/config-eslint/patch.js');

module.exports = {
  extends: ['./node_modules/@ricklove/config-eslint/rules.js'],
  parserOptions: { tsconfigRootDir: __dirname },
};
