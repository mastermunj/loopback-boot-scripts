'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _ = require('lodash');

exports.default = function (app) {

  if (!BootScriptConfig.isEnabled('globalPromise')) {
    return;
  }

  global.Promise = require('bluebird');
};