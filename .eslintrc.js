module.exports = {
  extends: ['@energyweb'],
  env: {
    browser: true,
    es2021: true,
    node: true,
    mocha: true,
  },
  parserOptions: {
    project: ['tsconfig.json', 'tsconfig.eslint.json'],
  },
};
