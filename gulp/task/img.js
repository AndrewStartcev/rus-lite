const { src, dest } = require('gulp');
// Плагины
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');
const webp = require('gulp-webp');

// Конфигурация
const path = require('../config/path.js')
const app = require('../config/app.js');
const gulpIf = require('gulp-if');

// Обработка Images
const img = () => {
  return src(path.img.src)
    .pipe(plumber({
      errorHandler: notify.onError(error => ({
        title: "Ошибка в Изображениях",
        message: error.message
      }))
    }))
    .pipe(newer(path.img.dest))
    .pipe(gulpIf(app.isWebp, webp()))
    .pipe(dest(path.img.dest))
    .pipe(src(path.img.src))
    .pipe(newer(path.img.dest))
    .pipe(gulpIf(app.isProd, imagemin(app.imgmin)))
    .pipe(dest(path.img.dest))
}


module.exports = img
