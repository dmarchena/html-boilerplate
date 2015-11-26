import gulp from 'gulp';

import autoprefixer from 'autoprefixer';
import bowerFiles from 'main-bower-files';
import bowerInstall from 'gulp-bower';
import concat from 'gulp-concat';
import cssnano from 'cssnano';
import del from 'del';
import foreach from 'gulp-foreach';
import merge from 'merge2';
import path from 'path';
import { readFileSync as readFile} from 'fs';
import replace from 'gulp-replace';
import runSequence from 'run-sequence';
import postcss from 'gulp-postcss';
import postcssAtImport from 'postcss-import';
import sourcemaps from 'gulp-sourcemaps';
import { sync as exists } from 'path-exists';
import webserver from 'gulp-webserver';
import uglify from 'gulp-uglify';

const helpers = {
  bowerDirname: () => {
    const cwd = process.cwd();
    const bowerrc = path.resolve(cwd, '.bowerrc');
    let bowerDirectory = 'bower_components';
    let config = null;

    if (exists(bowerrc)) {
      config = JSON.parse(readFile(bowerrc, 'utf-8'));
      if (config.directory) {
        bowerDirectory = config.directory;
      }
    }

    return bowerDirectory;
  },
};
const bowerDirname = helpers.bowerDirname();

gulp.task('html', () => {
  return gulp.src('src/**/*.html')
    .pipe(gulp.dest('dist'));
});

gulp.task('images', ['images:bower', 'images:favicon'], () => {
  return gulp.src('src/images/**/*')
    .pipe(gulp.dest('dist/images'));
});

gulp.task('images:bower', () => {
  return gulp.src(bowerFiles({ filter: '**/images/*.*' }))
    .pipe(foreach((stream, file) => {
      const packageName = file.path.match(new RegExp(`.*${bowerDirname}\/([^\/]*)\/.*`))[1];
      return stream.pipe(gulp.dest(`dist/images/bower/${packageName}`));
    }));
});

gulp.task('images:favicon', () => {
  return gulp.src('src/favicon*.*')
    .pipe(gulp.dest('dist/'));
});

gulp.task('bower:install', () => bowerInstall());
gulp.task('bower:update', () => bowerInstall({ cmd: 'update' }));

gulp.task('scripts', () => {
  const bower = gulp.src(bowerFiles({ filter: '**/*.js' }));
  const myScripts = gulp.src('src/js/**/*.js');
  return merge(bower, myScripts)
    .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(concat('bundle.js'))
      .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/js'));
});

gulp.task('styles', () => {
  const bower = gulp.src(bowerFiles({ filter: '**/*.css' }))
    .pipe(foreach((stream, file) => {
      const regexBower = new RegExp(`.*${bowerDirname}\/([^\/]*)\/.*`);
      const packageName = file.path.match(regexBower)[1];
      return stream.pipe(
        replace(/url\(\"?(?:\/?(?:[^\/\\:)]*\/)*)([^\/\)\"]*)\"?\)[\;\s\}]{1}/gim, `url(../images/bower/${packageName}/$1)`)
      );
    }));
  const myStyles = gulp.src('src/css/main.css');
  return merge(bower, myStyles)
    .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(concat('main.css'))
      .pipe(postcss([
        postcssAtImport,
        autoprefixer({ browsers: ['last 2 versions'] }),
        cssnano,
      ]))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/css'));
});

// Clean output directory
gulp.task('clean', () => del(['.tmp', 'dist/*', '!dist/.git'], {dot: true}));

// Start dist server
gulp.task('serve:dist', ['default'], () => {
  return gulp.src('dist')
    .pipe(webserver({
      //host: '0.0.0.0', //uncomment to enable host option
      port: 8080,
      fallback: 'index.html',
      livereload: true,
    }));
});
gulp.task('serve', ['serve:dist']);

// Build production files, the default task
gulp.task('default', ['clean', 'bower:install'], cb =>
	runSequence(
    'styles',
		['html', 'images', 'scripts'],
		cb)
);
