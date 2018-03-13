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
      webpackConfig = require('./webpack.config.js'),
      svgSprite = require("gulp-svg-sprites");

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
    app: './src/styles/main.scss'
  },
  images: {
    src: 'src/images/',
    dest: 'build/assets/images/'
  },
  scripts: {
    src: 'src/scripts/**/*.js',
    dest: 'build/assets/scripts/'
  },
  fonts: {
    src: 'src/fonts/*.*',
    build: 'build/assets/fonts'
  }
}

function watch() {
  gulp.watch(paths.styles.src, styles)
  gulp.watch(paths.templates.src, templates)
  gulp.watch(paths.images.src, images)
  gulp.watch(paths.scripts.src, scripts)
  gulp.watch(paths.fonts.src, fonts)
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

function deleteFiles() {
  return del('build/assets/images/css')
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
  return gulp.src('src/images/icons/*.svg')
    .pipe(svgSprite( {preview: false} ))
    .pipe(gulp.dest(paths.images.dest))
}

function fonts() {
  return gulp.src(paths.fonts.src)
    .pipe(gulp.dest(paths.fonts.build))
}



exports.templates = templates;
exports.styles = styles;
exports.clean = clean;
exports.images = images;
exports.scripts = scripts;
exports.fonts = fonts;
exports.deleteFiles = deleteFiles;

gulp.task('start', 
  gulp.series(
    clean,
    gulp.parallel(
      styles, templates, images, scripts, fonts
    ),
    deleteFiles,
    gulp.parallel(
      watch, server
    )
))