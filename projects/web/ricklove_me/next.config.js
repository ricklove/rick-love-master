// require('crypto').randomBytes = () => 'FIXED_PREVIEW_MODE_ID';

// Deterministict build
module.exports = {
  generateBuildId: async () => {
    const gitHash = require('child_process').execSync('git rev-parse HEAD').toString().trim();
    console.log('nextjs generateBuildId - using git commit hash', { gitHash });
    return gitHash;
  },
  optimization: {
    moduleIds: 'deterministic',
  },
};
