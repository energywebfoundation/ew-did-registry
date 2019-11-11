const { series, src, dest } = require('gulp');
const fs = require('fs');
const path = require('path');
const del = require('del');
const replace = require('gulp-replace');
const rename = require('gulp-rename');
const streamify = require('gulp-streamify');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const tsify = require('tsify');
const lernaJSON = require('./lerna.json');

const DEST = path.join(__dirname, 'packages/core/dist/');

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
            "DEBUG": false
        }
    }
};

function clean(done) {
    del([ DEST ]);
    done();
}

function version() {
    if (!lernaJSON.version) {
        throw new Error("version property is missing from lerna.json");
    }

    const version = lernaJSON.version;
    const jsonPattern = /"version": "[.0-9\-a-z]*"/;
    const glob = [
        './package.json',
    ];

    return src(glob, {
        base: './'
    })
        .pipe(replace(jsonPattern, '"version": "' + version + '"'))
        .pipe(dest('./'));
}

function bundling(package) {
    return browserify({
        basedir: '.',
        debug: true,
        derequire: true,
        insertGlobalVars: false,
        detectGlobals: true,
        bundleExternal: true,
        entries: [ path.join(package.src, 'src/index.ts') ],
        cache: {},
        packageCache: {}
    })
        .plugin(tsify, { p: package.src})
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(streamify(babel({
            compact: true,
            presets: [
                ['env', {
                    "modules": false
                }]
            ]
        })))
        .pipe(streamify(uglify(uglifyOptions)))
        .pipe(rename(package.fileName + '.min.js'))
        .pipe(sourcemaps.write('./'))
        .pipe(dest(DEST));
}

function bundleAll() {
    packages.forEach(function (pckg) {
        bundling(pckg);
    })
}

exports.clean = clean;
exports.version = version;
exports.bundleAll = bundleAll;
exports.default = series(clean, version, bundleAll);

