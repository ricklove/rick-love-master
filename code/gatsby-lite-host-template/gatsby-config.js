// support source maps
require(`source-map-support`).install();
// support .ts, .tsx
require(`ts-node`).register({ files: true });
// Support tsconfig paths
require(`tsconfig-paths`).register();
module.exports = require('gatsby-lite/gatsby-config.ts');