var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var angularFilesort = require('gulp-angular-filesort');
var inject = require('gulp-inject');
var wiredep = require('wiredep').stream;
var replace = require('gulp-replace');
var useref = require('gulp-useref');
var del = require('del');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');
var ngAnnotate = require('gulp-ng-annotate');
var mainBowerFiles = require('main-bower-files');
var zip = require('gulp-zip');
var sass = require('gulp-sass');

var conf = require('./config.json');

gulp.task('serve', ['inject', 'sass'], function () {

    browserSync.init({
        startPath: '/',
        server: {
            baseDir: [
                conf.paths.tmp,
                conf.paths.src
            ]
        },
        port: 8100
    });

    gulp.watch(conf.paths.src + '/sass/*.scss', ['sass']);
    gulp.watch([
            conf.paths.src + '/**/*.css',
            conf.paths.src + '/**/*.js',
            conf.paths.src + '/**/*.html',
            'bower_components/**/*'
        ], ['browser-reload']);
});

gulp.task('browser-reload', ['inject'], function() {
    browserSync.reload();
});

gulp.task('inject', ['move-lib:dev'], function () {

    var injectStyles = gulp.src([
            conf.paths.src + '/**/*.css'
        ]
    );

    var injectScripts = gulp.src([
        conf.paths.src + '/**/*.js'
    ]).pipe(angularFilesort());


    return gulp.src(conf.paths.src + '/index.html')
        .pipe(inject(injectStyles, {relative: true}))
        .pipe(inject(injectScripts, {relative: true}))
        //inject bower files
        .pipe(wiredep({
            'ignorePath': '../'
        }))
        // write the injections to the .tmp/index.html file
        .pipe(gulp.dest(conf.paths.tmp));
    // so that src/index.html file isn't modified
    // with every commit by automatic injects

});
gulp.task('move-lib:dev', ['replace:dev'], function () {
    return gulp.src(mainBowerFiles(), {base: "./"})
        .pipe(gulp.dest(conf.paths.tmp))
});

gulp.task('replace:dev', ['clean:tmp'], function () {
    return gulp.src(conf.paths.src + '/app.js')
        .pipe(replace(/<API_BASE_PATH>/g, conf.devBaseApiEndpoint))
        .pipe(gulp.dest(conf.paths.tmp))
});

gulp.task("clean:tmp", function () {
    return del([conf.paths.tmp + '/**/*']);
});


//PRODUCTION

gulp.task('prod', ['dist'], function () {
    gulp.src(conf.paths.dist + '/**', {base: conf.paths.dist})
        .pipe(zip(conf.zipName))
        .pipe(gulp.dest(conf.paths.target));
});

gulp.task('dist', ['move:assets'], function () {
    var injectStyles = gulp.src([
            conf.paths.src + '/**/*.css'
        ], {read: false}
    );

    var injectScripts = gulp.src([
        conf.paths.src + '/app.js',
        conf.paths.src + '/**/*.js'
    ]);

    return gulp.src(conf.paths.src + '/index.html')
        .pipe(inject(injectStyles, {relative: true}))
        .pipe(inject(injectScripts, {relative: true}))
        .pipe(wiredep({
            'ignorePath': '../'
        }))
        .pipe(useref())
        .pipe(gulpif('*.js', ngAnnotate()))
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', cleanCSS()))
        .pipe(replace(/<API_BASE_PATH>/g, conf.prodBaseApiEndpoint))
        .pipe(gulp.dest(conf.paths.dist))
});

gulp.task('move:assets', ['move-lib:dist', 'sass'], function () {
    return gulp.src([
            conf.paths.src + '/**',
            '!' + conf.paths.src + '/**/*.scss',
            '!' + conf.paths.src + '/**/*.css',
            '!' + conf.paths.src + '/**/*.js',
            '!' + conf.paths.src + '/index.html'
        ], {nodir: true})
        .pipe(gulp.dest(conf.paths.dist));
});

gulp.task('move-lib:dist', ['clean:target'], function () {
    return gulp.src(mainBowerFiles(), {base: "./"})
        .pipe(gulpif("*.js", uglify()))
        .pipe(gulpif("*.css", cleanCSS()))
        .pipe(gulp.dest(conf.paths.dist))
});

gulp.task("clean:target", function () {
    return del([conf.paths.target + '/**/*']);
});


//SASS

gulp.task('sass', function () {
    return gulp.src(conf.paths.src + '/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(conf.paths.src + '/css'));
});
