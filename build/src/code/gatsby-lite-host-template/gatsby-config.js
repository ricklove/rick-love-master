require(`source-map-support`).install();
require(`ts-node`).register({ files: true });
module.exports = require('../../code/gatsby-lite/src/gatsby-config.ts');