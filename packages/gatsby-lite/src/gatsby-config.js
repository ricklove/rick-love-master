// From: https://www.extensive.one/converting-gatsby-config-and-node-api-to-typescript/


/**
* Source-map-support mimics node's stack trace making debugging easier
* ts-node register helps importing and compiling TypeScript modules into JS
*/
require(`source-map-support`).install();
require(`ts-node`).register({ files: true });

module.exports = require(`./gatsby-config-ts.ts`);
