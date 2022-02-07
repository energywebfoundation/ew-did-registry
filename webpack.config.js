const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const { merge } = require('webpack-merge');

const baseConfig = {
  mode: 'production',
  output: {
    library: {
      type: 'commonjs',
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    mainFiles: ['index.ts', 'index.js'],
  },
};

const nodeConfig = merge(baseConfig, { target: 'node' });
const webConfig = merge(baseConfig, {
  target: 'web',
  plugins: [new NodePolyfillPlugin()],
  resolve: {
    fallback: {
      fs: false,
    },
  },
});

module.exports = { webConfig, nodeConfig };
