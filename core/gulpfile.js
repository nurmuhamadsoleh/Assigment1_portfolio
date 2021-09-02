const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require("gulp-uglify");
const injectPartials = require('gulp-file-include');
const browserSync = require('browser-sync').create();
const path = require('path');
const clean = require('gulp-clean');
const runs = require('run-sequence');
const log = require('fancy-log');

/* Target dest for compiled task */
const targetPath = "../public";

/* Path URL list */
const paths = {
  sass:
    {
      main:
        [
          'sass/*.scss'
        ]
    },       
  js:
    {
      app:
        [
          'script/*.js'
        ]
    }
};

/* === Task Cleaner Start === */

/* Clean CSS main */
function clean_sass_main() {
  return gulp.src([
    (targetPath + '/assets/css/main.css'), 
    (targetPath + '/assets/css/maps/main.css.map')
    ], {read: false, allowEmpty: true})
  .pipe(clean({force: true}));
}
/* Clean JS App */
function clean_js_app() {
  return gulp.src([
    (targetPath + '/assets/js/*.js')
    ], {read: false, allowEmpty: true})
  .pipe(clean({force: true}));
}
/* === Task Cleaner End === */

/* Task for CSS main.css */
function sass_main() {
  return gulp.src(paths.sass.main)
    .pipe(concat('main.css'))
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'compressed'
    }).on('error scss', sass.logError))
    .pipe(postcss([cssnano()]))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest(targetPath + '/assets/css'))
    .pipe(browserSync.stream())
}

/* Task for JS app */
function js_app() {
  return gulp.src(paths.js.app, { sourcemaps: true })
    .pipe(concat('app.min.js'))
    .pipe(babel())
    .pipe(uglify())
    .pipe(gulp.dest(targetPath + '/assets/js', { sourcemaps: true }))
    .pipe(browserSync.stream())
}

/* Task HTML Build */
function html() {
  return gulp.src(("views/pages/*.html"))
    .pipe(injectPartials({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest((targetPath)))
    .pipe(browserSync.stream())
}

/* Task Watch */
function watcher() {
  gulp.watch('sass/**/*', gulp.series('sass_main'));
  gulp.watch(paths.js.app, gulp.series('js_app'));
}

/* Task BrowserSync */
function initBrowserSync() {
  browserSync.init({
    server: {
      baseDir: [(targetPath)]
    }
  });

  gulp.watch('views/**/*.html', gulp.series(html));
}

/* Task List */
gulp.task('sass_main', gulp.series(clean_sass_main, sass_main));
gulp.task('js_app', gulp.series(clean_js_app, js_app));

/* === Init Task === */
gulp.task('init', gulp.parallel('sass_main', 'js_app'));



/* FE Slicing Commmand type "gulp" */
exports.default = gulp.parallel('init', html, watcher, initBrowserSync);

/* BE Integrated Commmand type "gulp dev" */
exports.dev = gulp.parallel('init', watcher);