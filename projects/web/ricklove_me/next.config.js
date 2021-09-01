const options = {
  // Deterministict build
  generateBuildId: async () => {
    const gitHash = require('child_process').execSync('git rev-parse HEAD').toString().trim();
    console.log('nextjs generateBuildId - using git commit hash', { gitHash });
    return gitHash;
  },
  optimization: {
    moduleIds: 'deterministic',
  },
};

const withTM = require('next-transpile-modules')(['@ricklove/ricklove_me-content']);
module.exports = withTM(options);

// // Bundle anayzer
// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//   //enabled: process.env.ANALYZE === 'true',
//   enabled: true,
// });
// module.exports = withBundleAnalyzer(options);
