/// <binding AfterBuild='build-client' />
/*
This file in the main entry point for defining Gulp tasks and using Gulp plugins.
Click here to learn more. http://go.microsoft.com/fwlink/?LinkId=518007
*/

var gulp = require('gulp'),
    rimraf = require("rimraf"),
    typescript = require("gulp-typescript"),
    rollup = require("rollup-stream"),
    source = require("vinyl-source-stream"),
    runsequence = require("run-sequence"),
    uglify = require("gulp-uglify"),
    concat = require("gulp-concat");

var paths = {
    approot: "./app/",
    build_temp: './dist/.temp',
    build_rollup: './dist/.rollup',
    build: './dist'
};

gulp.task("build-client", function (callback) {
    runsequence(
        'build-client:clean',
        'build-client:inline',
        'build-client:other',
        'build-client-prod:build-es2015',
        'build-client-prod:rollup',
        'build-client-prod:build-es5',
        "build-client-prod:min",
        function (error) {
            if (error) {
                console.log(error.message);
            } else {
                console.log('Build finished successfully');
            }
            callback(error);
        });
});

gulp.task("build-client:clean", function (cb) {
    return (rimraf(paths.build, cb));
});

gulp.task("build-client:other", function () {
    return (gulp.src(paths.approot + '**/!(*.component).ts')
    .pipe(gulp.dest(paths.build_temp)));
});

gulp.task("build-client:inline", function () {
    return (gulp.src(paths.approot + '**/*.component.ts')
    .pipe(gulp.dest(paths.build_temp)));
});

gulp.task("build-client-prod:build-es2015", ['build-client:inline', 'build-client:other'], function () {
    var tsProject = typescript.createProject('tsconfig.json');

    return (gulp.src([paths.build_temp + '/**/*.ts', paths.typings + 'globals/!(es6-shim)/index.d.ts'])
        .pipe(typescript(tsProject))
        .pipe(gulp.dest(paths.build_rollup)));
});

gulp.task("build-client-prod:rollup", function () {
    return (rollup('rollup.config.js')
        .pipe(source('bundle.es2015.js'))
        .pipe(gulp.dest(paths.build)));
});

gulp.task("build-client-prod:build-es5", function () {
    var tsProject = typescript.createProject({
        target: 'es5',
        allowJs: true,
        outFile: 'bundle.js'
    });

    return (gulp.src(paths.build + '/bundle.es2015.js')
            .pipe(typescript(tsProject, undefined, typescript.reporter.fullReporter))
            .pipe(gulp.dest(paths.build)));
});

gulp.task("build-client-prod:min", function () {
    return (gulp.src(paths.build + '/bundle.js')
        .pipe(concat('bundle.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(paths.build)));
});

gulp.task('default', function () {
    // place code for your default task here
});