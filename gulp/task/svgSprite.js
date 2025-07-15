const { src, dest } = require('gulp');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const svgSprite = require('gulp-svg-sprite');

// Конфигурация
const path = require('../config/path.js');
const app = require('../config/app.js');

// Настройки для SVG спрайта
const config = {
  mode: {
    symbol: {
      sprite: "../sprite.svg", // Имя файла спрайта
      example: false
    }
  }
};

// Обработка SVG спрайтов
const svgSpriteTask = () => {
  return src(path.svg.src)
    .pipe(plumber({
      errorHandler: notify.onError(error => ({
        title: "SVG Sprite Error",
        message: error.message
      }))
    }))
    .pipe(svgSprite(config))
    .pipe(dest(path.svg.dest));
};

module.exports = svgSpriteTask;
