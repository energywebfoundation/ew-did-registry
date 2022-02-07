const path = require('path');

const { merge } = require('webpack-merge');

const baseConfig = require('../../webpack.config.js');

const config = {
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js'
  },
};

module.exports = merge(baseConfig, config);;
