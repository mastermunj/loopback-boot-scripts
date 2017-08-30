'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _ = require('lodash');

exports.default = function (app) {

  if (!BootScriptConfig.isEnabled('globalModels')) {
    return;
  }

  _.assign(global, app.models);
};