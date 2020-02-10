// Karma configuration

module.exports = function (config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['browserify', 'mocha', 'chai-as-promised', 'chai'],

    // list of files / patterns to load in the browser
    files: [
      'node_modules/@babel/polyfill/dist/polyfill.js',
      // "node_modules/chai/chai.js",
      // 'node_modules/karma-chai/adapter.js',
      // "node_modules/mocha/mocha.js",
      // 'node_modules/karma-mocha/lib/adapter.js',
      'tests/bundledApp.js',
      'tests/browser.test.js',
    ],


    // list of files / patterns to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'node_modules/chai-as-promised/lib/chai-as-promised.js': ['browserify'],
      'tests/browser.test.js': ['browserify'],
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // eslint-disable-next-line max-len
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome', 'Firefox'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,

    browserNoActivityTimeout: 0,

    client: {
      mocha: {
        reporter: 'spec',
        ui: 'bdd',
      },
      captureConsole: true,
    },

    browserify: {
      debug: true,
      transform: [
        [
          'babelify', {
            presets: ['@babel/env'],
          },
        ],
      ],
    },

    // babelPreprocessor: {
    //   options: {
    //     presets: ['@babel/env'],
    //     sourceMap: 'inline',
    //   },
    //   filename(file) {
    //     return file.originalPath.replace(/\.js$/, '.es5.js');
    //   },
    //   sourceFileName(file) {
    //     return file.originalPath;
    //   },
    // },

    browserConsoleLogOptions: {
      terminal: true,
    },
  });
};
