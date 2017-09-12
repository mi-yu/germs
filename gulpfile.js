var gulp = require('gulp');
var gls = require('gulp-live-server');
var sass = require('gulp-sass');
var autoprefix = require('gulp-autoprefixer');
var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');
var jsmin = require('gulp-jsmin');
var livereload = require('gulp-livereload');
var imagemin = require('imagemin');

gulp.task('serve', ['sass', 'js'], function() {
	var server = gls('index.js', undefined, 1111);
	server.start();
	livereload.listen();
   
	gulp.watch(['./index.js', './routes/*.js'], function() {
		console.log('index.js changed');
		server.start.bind(server)();
	});

	gulp.watch('./assets/scss/**/*.scss', ['sass']);

	gulp.watch('./assets/js/**/*.js', ['js']);
});

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
	return gulp.src('./assets/scss/style.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefix())
		.pipe(cssmin())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('./public/css'))

});

gulp.task('js', function() {
	return gulp.src('./assets/js/*.js')
		.pipe(jsmin())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('./public/js'))

})

gulp.task('watch', ['sass', 'js', 'fonts'], function () {
	gulp.watch('./assets/scss/**/*.scss', ['sass']);
	gulp.watch('./assets/js/**/*.js', ['js']);
});

gulp.task('build', ['sass', 'js', 'imgs', 'fonts']);