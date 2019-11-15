const path = require('path');

const { series, src, dest } = require('gulp');
const replace = require('gulp-replace');
const rename = require('gulp-rename');
const streamify = require('gulp-streamify');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const typedoc = require('gulp-typedoc');

const del = require('del');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const tsify = require('tsify');

const lernaJSON = require('./lerna.json');
const configDependabot = require('./.dependabot');

const DEST = path.join(__dirname, 'build/');

const packages = [{
  fileName: 'core',
  expose: 'Core',
  src: path.join(__dirname, 'packages/core'),
  config: path.join(__dirname, 'packages/core/tsconfig.json')
}];

const uglifyOptions = {
  compress: {
    dead_code: true,
    drop_debugger: true,
    global_defs: {
      DEBUG: false
    }
  }
};

function clean(done) {
  del([ DEST ]);
  done();
}

function version() {
  if (!lernaJSON.version) {
    throw new Error('version property is missing from lerna.json');
  }

  const version = lernaJSON.version;
  const jsonPattern = /"version": "[.0-9\-a-z]*"/;
  const glob = [
      './package.json',
  ];

  return src(glob, {
      base: './'
  })
      .pipe(replace(jsonPattern, `"version": "${version}"`))
      .pipe(dest('./'));
}

function bundling(pckg) {
  return browserify({
    basedir: '.',
    debug: true,
    derequire: true,
    insertGlobalVars: false,
    detectGlobals: true,
    bundleExternal: true,
    entries: [ path.join(pckg.src, 'src/index.ts') ],
    cache: {},
    packageCache: {}
  })
    .plugin(tsify, { project: pckg.src })
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(streamify(babel({
      compact: true,
      presets: [
        ['@babel/env', {
          'modules': false
        }]
      ]
    })))
    .pipe(streamify(uglify(uglifyOptions)))
    .pipe(rename(pckg.fileName + '.min.js'))
    .pipe(sourcemaps.write('./'))
    .pipe(dest(DEST));
}

function bundleAll(done) {
  packages.forEach((pckg) => {
    bundling(pckg);
  });
  done()
}

function generateDependabotConfig(done) {
  configDependabot();
  done();
}

function buildDocs() {
  return src(['packages/**/*.ts', '!./packages/**/node_modules/**/*.ts', '!./packages/**/*.d.ts'])
    .pipe(typedoc({
      // TypeScript options (see typescript docs)
      module: 'commonjs',
      target: 'es5',
      includeDeclarations: false,
      lib: [ 'lib.esnext.full.d.ts' ],

      // TypeDoc options (see typedoc docs)
      out: './docs',
      exclude: '**/*+(e2e|spec).ts',
      excludeExternals: true,
      excludePrivate: true,
      excludeProtected: true,
      ignoreCompilerErrors: true,
      moduleResolution: 'node',
      preserveConstEnums: true,
      skipLibCheck: true,
      stripInternal: true,
      suppressExcessPropertyErrors: true,
      suppressImplicitAnyIndexErrors: true,
      mode: 'file',
      plugins: ['typedoc-plugin-markdown']
      // externalPattern: '**/node_modules/**',
    }));
}

exports.clean = clean;
exports.version = version;
exports.bundleAll = bundleAll;
exports.generateDependabotConfig = generateDependabotConfig;
exports.buildDocs = buildDocs;
exports.default = series(clean, version, bundleAll, buildDocs);
