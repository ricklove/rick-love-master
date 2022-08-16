module.exports = function (dirProject) {
  return require('@ricklove/config-eslint/index.js')(
    dirProject,
    './node_modules/@ricklove/config-lib-rig/node_modules/',
  );
};
