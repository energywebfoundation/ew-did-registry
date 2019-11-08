const { series, src, dest } = require('gulp');
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
const path = require('path');

const DEST = path.join(__dirname, 'packages/core/dist/');
const lernaJSON = require('./lerna.json');

const fs = require('fs');




const uglifyOptions = {
    compress: {
        dead_code: true,
        drop_debugger: true,
        global_defs: {
            "DEBUG": false
        }
    }
};

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

function bundling() {
    return browserify({
        basedir: '.',
        debug: true,
        derequire: true,
        insertGlobalVars: false,
        detectGlobals: true,
        bundleExternal: true,
        entries: [ path.join(__dirname, 'packages/core/src/index.ts') ],
        cache: {},
        packageCache: {}
    })
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
        .pipe(rename('index.min.js'))
        .pipe(sourcemaps.write('./'))
        .pipe(dest(DEST));
}

exports.default = series(version, bundling);
