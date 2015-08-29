'use strict';

/////////// IMPORTS ///////////

var gulp = require('gulp');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var gls = require('gulp-live-server');
var del = require('del');
var typescript = require('gulp-typescript');
// var tslint = require('gulp-tslint');
// var Karma = require('karma').Server;

/////////// CONFIG ///////////

var config = {
    libs: {
        js: [
            'node_modules/angular/angular.min.js',
            'node_modules/angular-route/angular-route.min.js',
            'bower_components/angular-aria/angular-aria.min.js',
            'bower_components/angular-animate/angular-animate.min.js',
            'bower_components/angular-material/angular-material.min.js',
            'lib/colors.js',
        ],
        style: [
            'bower_components/angular-material/angular-material.min.css',
            'bower_components/mdi/!(scss)*/*',
        ],
        map: [
            'node_modules/angular/angular.min.js.map',
            'bower_components/mdi/css/materialdesignicons.min.css.map',
            'bower_components/angular-animate/angular-animate.min.js.map',
            'bower_components/angular-aria/angular-aria.min.js.map',
            'node_modules/angular-route/angular-route.min.js.map',
        ]
    },
    test: {
        conf: '\src\test\karma-conf.js',
    },
    app: {
        root: 'src/app',
        ts: ['src/app/**/*.module.ts', 'src/app/**/*.service.ts', 'src/app/**/*.controller.ts'],
        js: 'src/app/tsout.js',
        parts: 'src/app/parts/*.html',
        img: 'src/app/img/*',
        index: 'src/index.html',
        style: 'src/style/main.scss',
        styles: 'src/style/**/*',
    },
    dist: {
        root: 'dist',
        files: 'dist/**/*',
        parts: 'dist/parts',
        img: 'dist/img',
    },
    server: {
        lrPort: 35729,
        port: 5000
    },
    tsConf: {
        module: 'commonjs',
        target: 'ES5',
        out: 'tsout.js'
    }
};

/////////// COMPILE AND MOVING TASKS ///////////

gulp.task('clean', function(cb) {  // bugs?
    del([config.dist.files], cb);
});

gulp.task('appCompile', function() {
    gulp.src(config.app.ts)
        // .pipe(tslint)
        // .pipe(tslint.report, 'verbose')
        .pipe(typescript(config.tsConf))
        .pipe(gulp.dest(config.app.root));
});
        
gulp.task('appJs', function() {
    gulp.src(config.app.js)
        .pipe(concat('app.js'))
        .pipe(gulp.dest(config.dist.root));
});

gulp.task('app', ['appCompile'], function() {  // Same as tspcomJs, but with dependency to ts compile task
    gulp.src(config.app.js)
        .pipe(concat('app.js'))
        .pipe(gulp.dest(config.dist.root));
});

gulp.task('html', function() {
    gulp.src(config.app.index)
        .pipe(gulp.dest(config.dist.root));
    gulp.src(config.app.parts)
        .pipe(gulp.dest(config.dist.parts));
    gulp.src(config.app.img)
        .pipe(gulp.dest(config.dist.img));
});

gulp.task('libs', function() {
    gulp.src(config.libs.js)
        .pipe(concat('lib.js'))
        .pipe(gulp.dest(config.dist.root));
    gulp.src(config.libs.map)
        .pipe(gulp.dest(config.dist.root));
    gulp.src(config.libs.style)
        .pipe(gulp.dest(config.dist.root));
});

gulp.task('style', function() {
    gulp.src(config.app.style)
        .pipe(sass())
        .pipe(concat('style.css'))
        .pipe(gulp.dest(config.dist.root));
});

gulp.task('build', ['app', 'html', 'libs', 'style']);  //'clean',

/////////// SERVER AND WATCH TASKS ///////////

gulp.task('server', function() {
    var server = gls.static(config.dist.root, config.server.port);
    server.start();
    gulp.watch(config.dist.files, function () {
        server.notify.apply(server, arguments);
    });
});

gulp.task('watch', function() {
    gulp.watch(config.app.ts, ['appCompile']);
    gulp.watch(config.app.js, ['appJs']);
    gulp.watch(config.app.styles, ['style']);
    gulp.watch(config.app.index, ['html']);
    gulp.watch(config.app.parts, ['html']);
    gulp.watch(config.app.img, ['html']);
    gulp.watch(config.app.js, ['app']);
});

gulp.task('tsWatch', function() {
    gulp.watch(config.app.ts, ['appCompile']);
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

