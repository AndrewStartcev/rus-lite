const { src, dest } = require('gulp');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const cssnano = require('gulp-cssnano');
const uglify = require('gulp-uglify');
const newer = require('gulp-newer');
const gulpIf = require('gulp-if');
const path = require('../config/path.js'); // Убедитесь, что путь к конфигурации правильный

// Проверка, является ли файл CSS
const isCss = file => file.extname === '.css';

// Проверка, является ли файл JS
const isJs = file => file.extname === '.js';
const isMinified = file => /\.min\.js$/.test(file.basename);

const lib = () => {
  return src(path.lib.src, { sourcemaps: true }) // Убедитесь, что путь к lib.src правильный
    .pipe(plumber({
      errorHandler: notify.onError(error => ({
        title: "Ошибка в Lib",
        message: error.message
      }))
    }))
    .pipe(gulpIf(isCss, cssnano())) // Минимизируем CSS файлы
    .pipe(gulpIf(isJs, gulpIf((file) => !isMinified(file) && !file.path.includes('node_modules'), uglify()))) // Минимизируем только не минимизированные JS файлы
    .pipe(dest(path.lib.dest, { sourcemaps: true })); // Указываем путь к папке назначения
};


module.exports = lib;
