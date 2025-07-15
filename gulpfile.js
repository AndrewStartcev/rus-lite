const { watch, series, parallel } = require("gulp");
const browserSync = require("browser-sync").create();

// Конфигурация
const path = require("./gulp/config/path.js");
const app = require("./gulp/config/app.js");

// Задачи
const clear = require("./gulp/task/clear.js");
const html = require("./gulp/task/html.js");
const scss = require("./gulp/task/scss.js");
const js = require("./gulp/task/js.js");
const img = require("./gulp/task/img.js");
const font = require("./gulp/task/font.js");
const svgSpriteTask = require("./gulp/task/svgSprite.js");
const lib = require("./gulp/task/lib.js");

// Сервер
const server = () => {
  browserSync.init({
    server: {
      baseDir: path.root,
    },
    notify: false, // Отключение уведомлений
    open: false, // Не открывать браузер автоматически
  });
};

// Задержка для перезагрузки
const reload = done => {
  browserSync.reload();
  done();
};

// Наблюдение с учетом завершения задач
const watcher = () => {
  watch(path.html.watch, series(html, reload));
  watch(path.scss.watch, series(scss, reload));
  watch(path.js.watch, series(js, reload));
  watch(path.img.watch, series(img, reload));
  watch(path.font.watch, series(font, reload));
  watch(path.svg.watch, series(svgSpriteTask, reload));
  watch(path.lib.src, series(lib, reload));
};

// Основная сборка
const build = series(clear, parallel(html, scss, js, img, font, svgSpriteTask, lib), parallel(watcher, server));

// Разработка
const dev = series(build, parallel(watcher, server));

// Экспорт задач
exports.html = html;
exports.scss = scss;
exports.js = js;
exports.img = img;
exports.font = font;
exports.svgSpriteTask = svgSpriteTask;
exports.lib = lib;
exports.watch = watcher;
exports.clear = clear;

// Сборка
exports.default = app.isProd ? build : dev;

// --prod --webp
// gulp svgSprite
// mobile wi-fi test: http://192.168.0.14: -port
