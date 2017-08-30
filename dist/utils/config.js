'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _ = require('lodash');

var Config = function () {
  function Config(app) {
    _classCallCheck(this, Config);

    this._app = app;
    this._config = app.get('bootScripts');
  }

  _createClass(Config, [{
    key: 'get',
    value: function get(key) {
      var defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

      return _.get(this._config, key, defaultValue);
    }
  }, {
    key: 'isEnabled',
    value: function isEnabled(key) {
      return !(
      // Can be disabled by setting false
      _.hasIn(this._config, key) && this._config[key] === false ||
      // OR by setting enabled = false within the config object
      _.hasIn(this._config, [key, 'enabled']) && this._config[key]['enabled'] === false);
    }
  }]);

  return Config;
}();

exports.default = Config;