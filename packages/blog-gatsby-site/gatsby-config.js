console.log(`gatspy-config.js START`);

require(`source-map-support`).install();
require(`ts-node`).register({ files: true });
module.exports = require('gatsby-lite/gatsby-config.ts');