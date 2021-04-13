/* eslint-disable @typescript-eslint/camelcase */
const path = require('path');
const fs = require('fs');

const { series, dest } = require('gulp');
const rename = require('gulp-rename');
const streamify = require('gulp-streamify');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');

const del = require('del');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const tsify = require('tsify');

const configDependabot = require('./.dependabot');

const BUILD = path.join(__dirname, 'build/');
const DOCS = path.join(__dirname, 'docs/');

const packages = fs.readdirSync(path.join(__dirname, './packages'))
  .filter((directory) => !['proxyIdentity', 'authentication'].includes(directory))
  .map((directory) => ({
    fileName: directory,
    expose: directory.replace(/-([a-z])/g, (g) => g[1].toUpperCase()),
    src: path.join(__dirname, `packages/${directory}`),
    config: path.join(__dirname, `packages/${directory}/tsconfig.json`),
  }));

const uglifyOptions = {
  compress: {
    dead_code: true,
    drop_debugger: true,
    global_defs: {
      DEBUG: false,
    },
  },
};

function clean(done) {
  del([BUILD, DOCS]);
  done();
}

function bundling(pckg) {
  return browserify({
    basedir: '.',
    debug: true,
    derequire: true,
    insertGlobalVars: false,
    detectGlobals: true,
    bundleExternal: true,
    entries: [path.join(pckg.src, 'src/index.ts')],
    cache: {},
    packageCache: {},
    standalone: pckg.expose, // in browser will be globals keys, didRegistry, didResolver,...
  })
    .plugin(tsify, { project: pckg.src })
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(streamify(babel({
      compact: true,
      presets: [
        ['@babel/env', {
          modules: false,
        }],
      ],
    })))
    .pipe(streamify(uglify(uglifyOptions)))
    .pipe(rename(`${pckg.fileName}.min.js`))
    .pipe(sourcemaps.write('./'))
    .pipe(dest(BUILD));
}

function bundleAll(done) {
  packages.forEach((pckg) => {
    bundling(pckg);
  });
  done();
}

function generateDependabotConfig(done) {
  configDependabot();
  done();
}

exports.clean = clean;
exports.bundleAll = bundleAll;
exports.generateDependabotConfig = generateDependabotConfig;
exports.default = series(clean, bundleAll);
