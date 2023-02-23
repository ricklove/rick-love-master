module.exports = {
  transpilePackages: ['@ricklove/ricklove_me-content'],
  // Deterministict build
  generateBuildId: async () => {
    const gitHash = require('child_process').execSync('git rev-parse HEAD').toString().trim();
    console.log('nextjs generateBuildId - using git commit hash', { gitHash });
    return gitHash;
  },
  // optimization: {
  //   moduleIds: 'deterministic',
  // },
};

// // Bundle anayzer
// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//   //enabled: process.env.ANALYZE === 'true',
//   enabled: true,
// });
// module.exports = withBundleAnalyzer(options);
