const { src, dest } = require('gulp');
// Плагины
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const htmlBeautify = require('gulp-html-beautify');
const fileInclude = require('gulp-file-include');
const webpHtml = require('gulp-webp-html');

// Конфигурация
const path = require('../config/path.js')
const app = require('../config/app.js')
const size = require('gulp-size');
const gulpIf = require('gulp-if');

// Обработка html
const html = () => {
  return src(path.html.src)
    .pipe(plumber({
      errorHandler: notify.onError(error => ({
        title: "Ошибка в HTML",
        message: error.message
      }))
    }))
    .pipe(size({ title: "src.html" }))
    .pipe(fileInclude())
    .pipe(gulpIf(app.isWebp, webpHtml()))
    .pipe(htmlBeautify({
      indent_size: 2,
      indent_char: ' ',
      unformatted: ['code', 'pre', 'em', 'strong'],
      extra_liners: ['head', 'body', '/html']
    }))
    .pipe(size({ title: "public.html" }))
    .pipe(dest(path.html.dest))

}


module.exports = html
