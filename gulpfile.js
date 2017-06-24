var gulp        = require('gulp');
var browserSync = require('browser-sync');
var sass        = require('gulp-sass');
var reload      = browserSync.reload;
var autoprefix = require('gulp-autoprefixer');
var cssmin = require('gulp-cssmin');
var filter = require('gulp-filter')
var rename = require('gulp-rename');
var jsmin = require('gulp-jsmin');
var uncss = require('gulp-uncss');
var imagemin = require('gulp-imagemin')

gulp.task('imgs', function() {
    return gulp.src('./assets/imgs/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./public/imgs'));
});

gulp.task('fonts', function() {
    return gulp.src('./assets/fonts/*')
        .pipe(gulp.dest('./public/fonts'));
});

gulp.task('setWatch', function() {
    global.isWatching = true;
});

gulp.task('sass', function () {
    return gulp.src('./assets/scss/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefix())
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./public/css'))
        .pipe(reload({stream: true}));
});

gulp.task('js', function() {
    return gulp.src('./assets/js/*.js')
        .pipe(jsmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./public/js'))
        .pipe(reload({stream: true}));
})

gulp.task('watch', ['sass', 'js', 'fonts'], function () {

    //browserSync({server: './', notify: false});
    gulp.watch('./assets/scss/*.scss', ['sass']);
    gulp.watch('./assets/js/*.js', ['js']);
});

gulp.task('build', ['sass', 'js', 'imgs', 'fonts']);