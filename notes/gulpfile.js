'use strict';

/////////// IMPORTS ///////////

var gulp = require('gulp');
var del = require('del');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var gls = require('gulp-live-server');
var typescript = require('gulp-typescript');
var merge = require('merge2');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');
var reactify = require('reactify');
// var uglify = require('gulp-uglify');
// var tslint = require('gulp-tslint');
// var Karma = require('karma').Server;

/////////// CONFIG ///////////

var config = {
    libs: {
        js: [
            'lib/colors.js',
        ],
        style: [
            'node_modules/angular-material/angular-material.min.css',
            'bower_components/mdi/!(scss)*/*',
        ],
        map: [
            'bower_components/mdi/css/materialdesignicons.min.css.map',
        ]
    },
    ts: {
        src: 'src/app/**/*.ts',
        conf: {
            module: 'commonjs',
            target: 'ES5',
            sortOutput: true
        },
    },
    src: {
        root: 'src/app',
        entry: './src/entry.js',
        js: 'src/app/**/*.js',
        parts: 'src/app/**/*.html',
        img: 'src/img/*',
        index: 'src/index.html',
        style: 'src/style/main.scss',
        styles: 'src/style/**/*',
        toClean: 'src/app/**/!(entry)*.js'
    },
    dist: {
        root: 'dist',
        files: 'dist/**/*',
        img: 'dist/img',
        jsLibName: 'lib.js',
        browserifyBundle: 'bundle.js',
    },
    server: {
        lrPort: 35729,
        port: 5000
    },
    test: {
        conf: '\src\test\karma-conf.js',
    },
};

/////////// COMPILE AND MOVING TASKS ///////////

gulp.task('clean', function() {
    del([config.dist.files]);
    del([config.src.toClean]);
});

gulp.task('ts', function() {
    var tsResult = gulp.src(config.ts.src)
        .pipe(typescript(config.ts.conf));
    
    return merge([
        tsResult.js
            .pipe(gulp.dest(config.src.root))
    ]);
});

gulp.task('content', function() {
    gulp.src(config.src.index)
        .pipe(gulp.dest(config.dist.root));
    gulp.src(config.src.parts)
        .pipe(gulp.dest(config.dist.root));
    gulp.src(config.src.img)
        .pipe(gulp.dest(config.dist.img));
});

gulp.task('libs', function() {
    gulp.src(config.libs.js)
        .pipe(concat(config.dist.jsLibName))
        .pipe(gulp.dest(config.dist.root));
    gulp.src(config.libs.map)
        .pipe(gulp.dest(config.dist.root));
    gulp.src(config.libs.style)
        .pipe(gulp.dest(config.dist.root));
});

gulp.task('style', function() {
    gulp.src(config.src.style)
        .pipe(sass())
        .pipe(concat('style.css'))
        .pipe(gulp.dest(config.dist.root));
});

gulp.task('browserify', function () {
    var b = browserify({
        entries: config.src.entry,
        debug: true,
        transform: [reactify], // defining transforms here will avoid crashing your stream
        ignoreMissing: true // For ignoring error messages. The websocket lib is using require as an argument for a function.
    });
    
    return b.bundle()
        .pipe(source(config.dist.browserifyBundle))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
            // Add transformation tasks to the pipeline here.
            // .pipe(uglify())
            // .on('error', gutil.log)
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(config.dist.root));
});

gulp.task('build', ['ts', 'libs', 'content', 'style', 'browserify']);  //'clean',

/////////// SERVER AND WATCH TASKS ///////////

gulp.task('server', function() {
    var server = gls.static(config.dist.root, config.server.port);
    server.start();
    gulp.watch(config.dist.files, function () {
        server.notify.apply(server, arguments);
    });
});

gulp.task('watch', function() {
    gulp.watch(config.ts.src, ['ts']);
    gulp.watch(config.src.js, ['browserify']);
    gulp.watch(config.src.styles, ['style']);
    gulp.watch(config.src.index, ['content']);
    gulp.watch(config.src.parts, ['content']);
    gulp.watch(config.src.img, ['content']);
});

/////////// TESTING TASKS //////////////

// gulp.task('test', ['tspcomCompile', 'tsWatch'], function(done) {
    // new Karma({
        // configFile: __dirname  + '/src/test/karma-conf.js',
        // singleRun: false
    // }, done).start();
// });

/////////// DEFAULT TASKS ///////////

gulp.task('default', ['build', 'server', 'watch']);

