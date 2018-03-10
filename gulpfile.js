const gulp = require('gulp'),
      pug = require('gulp-pug'),
      sass = require('gulp-sass'),
      rename = require('gulp-rename'),
      sourcemaps = require('gulp-sourcemaps'),
      del = require('del'),
      autoprefixer = require('gulp-autoprefixer'),
      browserSync = require('browser-sync').create(),
      gulpWebpack = require('gulp-webpack'),
      webpack = require('webpack'),
      webpackConfig = require('./webpack.config.js');

const paths = {
  root: './build',
  templates: {
    pages: 'src/templates/pages/*.pug',
    src: 'src/templates/**/*.pug',
    dest: 'build/assest'
  },
  styles: {
    src: 'src/styles/**/*.scss',
    dest: 'build/assets/styles/',
    app: './src/styles/app.scss'
  },
  images: {
    src: 'src/images/**/*.*',
    dest: 'build/assets/images/'
  },
  scripts: {
    src: 'src/scripts/**/*.js',
    dest: 'build/assets/scripts/'
  }
}

function watch() {
  gulp.watch(paths.styles.src, styles)
  gulp.watch(paths.templates.src, templates)
  gulp.watch(paths.images.src, images)
  gulp.watch(paths.scripts.src, scripts)
}

function server() {
  browserSync.init({
    server: paths.root
  });
  browserSync.watch(paths.root + '/**/*.*', browserSync.reload)
}

function clean() {
  return del(paths.root)
}

function scripts() {
  return gulp.src('src/scripts/app.js')
      .pipe(gulpWebpack(webpackConfig, webpack)) 
      .pipe(gulp.dest(paths.scripts.dest));
}

function templates() {
  return gulp.src(paths.templates.pages)
    .pipe(pug({ pretty: true }))
    .pipe(gulp.dest(paths.root))
}

function styles() {
  return gulp.src(paths.styles.app)
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(sourcemaps.write())
    .pipe(rename({ suffix: '.min' }))
    .pipe(autoprefixer({ browsers: ['last 2 versions'], cascade: false }))
    .pipe(gulp.dest(paths.styles.dest))
}

function images() {
  return gulp.src(paths.images.src)
    .pipe(gulp.dest(paths.images.dest))
}

exports.templates = templates;
exports.styles = styles;
exports.clean = clean;
exports.images = images;
exports.scripts = scripts;

gulp.task('start', 
  gulp.series(
    clean,
    gulp.parallel(
      styles, templates, images, scripts
    ),
    gulp.parallel(
      watch, server
    )
))