const path = require('path');
const fs = require('fs');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

module.exports = {
  appPath: resolveApp('.'),
  appBuild: resolveApp('dist'),
  appSrc: resolveApp('src'),
  appIndexJs: resolveApp('src/index.js'),
  appHtml: resolveApp('src/index.html'),
  appStyles: resolveApp('src/styles'),
  // TODO Use relative path until webpack-contrib/file-loader#281 gets fixed
  assetOutput: 'assets'
};
