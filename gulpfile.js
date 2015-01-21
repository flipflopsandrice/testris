var gulp        = require('gulp'),
    browserify  = require('gulp-browserify'),
    rename      = require('gulp-rename'),
    livereload  = require('gulp-livereload'),
    clean       = require('gulp-clean'),
    uglify      = require('gulp-uglify');

gulp.task('js', ['clean-js'], function() {
    return gulp.src('src/js/init.js')
        .pipe(browserify({
            insertGlobals : true
        }))
        .pipe(rename('app.js'))
        .pipe(gulp.dest('./build/js'))
        .pipe(uglify())
        .pipe(rename('app.min.js'))
        .pipe(gulp.dest('./build/js'))
        .pipe(livereload())
});

gulp.task('html', ['clean-html'], function() {
    return gulp.src('src/html/index.html')
        .pipe(gulp.dest('./build/'))
        .pipe(livereload())
});

gulp.task('resources', ['clean-res'], function() {
    return gulp.src('src/res/**/*')
        .pipe(gulp.dest('./build/res/'))
});

gulp.task('clean-js', function() {
    return gulp.src('build/js/*', { read: false })
        .pipe(clean())
});

gulp.task('clean-html', function() {
    return gulp.src('build/index.html', { read: false })
        .pipe(clean())
});

gulp.task('clean-res', function() {
    return gulp.src('build/res/*', { read: false })
        .pipe(clean())
});

gulp.task('watch', function() {
    livereload.listen();
    gulp.watch('src/js/**', ['js']);
    gulp.watch('src/html/index.html', ['html']);
});


gulp.task('default', ['js', 'html', 'resources'], function() {

});