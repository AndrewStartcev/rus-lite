const { src, dest } = require("gulp");
// Плагины
const plumber = require("gulp-plumber");
const notify = require("gulp-notify");
const concat = require("gulp-concat");
const cssImport = require("gulp-cssimport");
const autoprefixer = require("gulp-autoprefixer");
const csso = require("gulp-csso");
const rename = require("gulp-rename");
const shorthand = require("gulp-shorthand");
const groupCssMedia = require("gulp-group-css-media-queries");
const webpCss = require("gulp-webp-css");

// Конфигурация
const path = require("../config/path.js");
const app = require("../config/app.js");
const size = require("gulp-size");

// Обработка css
const css = () => {
  return (
    src(path.css.src, { sourcemaps: app.isDev })
      .pipe(
        plumber({
          errorHandler: notify.onError(error => ({
            title: "Ошибка в CSS",
            message: error.message,
          })),
        }),
      )
      .pipe(concat("style.css"))
      .pipe(cssImport())
      // .pipe(webpCss())
      .pipe(autoprefixer())
      // .pipe(shorthand())
      // .pipe(groupCssMedia())
      .pipe(size({ title: "style.css" }))
      .pipe(dest(path.css.dest, { sourcemaps: app.isDev }))
      .pipe(rename({ suffix: ".min" }))
      // .pipe(csso())
      .pipe(size({ title: "style.min.css" }))
      .pipe(dest(path.css.dest, { sourcemaps: app.isDev }))
  );
};

module.exports = css;
