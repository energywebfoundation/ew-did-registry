const path = require('path');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const { merge } = require('webpack-merge');

const baseConfig = {
  mode: 'production',
  entry: './src/index.ts',
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
    extensions: ['.ts', '.js'],
  },
  externals: {
    '@ew-did-registry/did': '@ew-did-registry/did',
    '@ew-did-registry/keys': '@ew-did-registry/keys',
    '@ew-did-registry/jwt': '@ew-did-registry/jwt',
    '@ew-did-registry/did-ethr-resolver': '@ew-did-registry/did-ethr-resolver',
    '@ew-did-registry/did-resolver-interface':
      '@ew-did-registry/did-resolver-interface',
    '@ew-did-registry/did-ipfs-store': '@ew-did-registry/did-ipfs-store',
    '@ew-did-registry/did-store-interface':
      '@ew-did-registry/did-store-interface',
    '@ew-did-registry/did-document': '@ew-did-registry/did-document',
    '@ew-did-registry/claims': '@ew-did-registry/claims',
    '@ew-did-registry/proxyidentity': '@ew-did-registry/did-proxyidentity',
    '@ew-did-registry/did-registry': '@ew-did-registry/did-registry',
    '@ew-did-registry/revocation': '@ew-did-registry/revocation',
    ethers: 'ethers',
    'ethereumjs-util': 'ethereumjs-util',
  },
};

const nodeConfig = merge(baseConfig, {
  target: 'node16',
  output: {
    filename: 'index.js',
  },
  externals: {
    eciesjs: 'eciesjs',
    base64url: 'base64url',
    sjcl: 'sjcl',
    '@types/sjcl': '@types/sjcl',
  },
});
const webConfig = merge(baseConfig, {
  target: 'web',
  output: {
    filename: 'index.esm.js',
  },
  plugins: [new NodePolyfillPlugin()],
  resolve: {
    fallback: {
      fs: false,
    },
  },
});

module.exports = [webConfig, nodeConfig];
