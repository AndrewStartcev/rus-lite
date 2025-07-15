const { src, dest } = require("gulp");
// Плагины
const plumber = require("gulp-plumber");
const notify = require("gulp-notify");
const autoprefixer = require("gulp-autoprefixer");
const csso = require("gulp-csso");
const rename = require("gulp-rename");
const shorthand = require("gulp-shorthand");
const groupCssMedia = require("gulp-group-css-media-queries");
const sass = require("gulp-sass")(require("sass"));
const sassGlob = require("gulp-sass-glob");
const size = require("gulp-size");

// Конфигурация
const path = require("../config/path.js");
const app = require("../config/app.js");

// Обработка SCSS (компиляция всех файлов по отдельности)
const scss = () => {
  return (
    src(path.scss.src, { sourcemaps: app.isDev }) // Берём все SCSS-файлы
      .pipe(
        plumber({
          errorHandler: notify.onError(error => ({
            title: "Ошибка в SCSS",
            message: error.message,
          })),
        }),
      )
      .pipe(sassGlob()) // Подключение глобальных mixins и переменных
      .pipe(sass()) // Компиляция SCSS → CSS
      .pipe(autoprefixer()) // Проставляем вендорные префиксы
      .pipe(shorthand()) // Оптимизация CSS-кода
      .pipe(groupCssMedia()) // Группировка медиазапросов
      .pipe(size({ title: "Исходный CSS" })) // Лог размера файла
      .pipe(dest(path.scss.dest, { sourcemaps: app.isDev })) // Выгрузка оригинального CSS

      // Минификация каждого файла отдельно
      .pipe(rename({ suffix: ".min" }))
      .pipe(csso()) // Минификация CSS
      .pipe(size({ title: "Минифицированный CSS" })) // Лог размера файла
      .pipe(dest(path.scss.dest, { sourcemaps: app.isDev }))
  ); // Выгрузка минифицированного файла
};

module.exports = scss;
