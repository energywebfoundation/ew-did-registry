const browserify = require('browserify');
const { dest } = require('gulp');
// import path from 'path';
const tsify = require('tsify');
const source = require('vinyl-source-stream');
const streamify = require('gulp-streamify');
const babel = require('gulp-babel');

function bundleApp() {
  return browserify({
    basedir: '.',
    detectGlobals: true,
    entries: ['app.ts'],
    standalone: 'app',
  })
    .plugin(tsify)
    .bundle()
    .pipe(source('bundledApp.js'))
    .pipe(streamify(babel({
      compact: true,
      presets: [
        ['@babel/env', {
          modules: false,
        }],
      ],
    })))
    .pipe(dest('./'));
}

exports.bundleApp = bundleApp;
