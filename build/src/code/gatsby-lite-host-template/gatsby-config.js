require(`source-map-support`).install();
require(`ts-node`).register({ files: true });
module.exports = require('../gatsby-lite/src/gatsby-config.ts');