'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _config = require('./utils/config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (app) {

  global.BootScriptConfig = new _config2.default(app);

  app.on('booted', function () {
    delete global.BootScriptConfig;
  });
};