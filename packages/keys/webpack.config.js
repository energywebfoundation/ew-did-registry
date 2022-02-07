const path = require('path');
const { merge } = require('webpack-merge');
const { webConfig, nodeConfig } = require('../../webpack.config.js');

module.exports = [
  merge(webConfig, {
    entry: './src/index.ts',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'index.web.js',
    },
  }),
  merge(nodeConfig, {
    entry: './src/index.ts',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'index.js',
    },
  }),
];
