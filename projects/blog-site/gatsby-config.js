// support source maps
require(`source-map-support`).install();
// support .ts, .tsx
require(`ts-node`).register({ files: true });
module.exports = require('gatsby-lite/gatsby-config.ts');