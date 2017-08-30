'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _customError = require('./utils/custom-error');

var _customError2 = _interopRequireDefault(_customError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _ = require('lodash');

exports.default = function (app) {

  if (!BootScriptConfig.isEnabled('customErrors')) {
    return;
  }

  var config = BootScriptConfig.get('customErrors');
  var errorsConfig = require('./utils/errors.json');
  if (config && config.errors) {
    var mode = config.mode || 'merge';
    if (mode === 'merge') {
      errorsConfig = _.merge(_.keyBy(errorsConfig, 'statusCode'), _.keyBy(config.errors, 'statusCode'));
    } else {
      errorsConfig = config.errors;
    }
  }

  var errors = {
    CustomError: _customError2.default
  };
  _.each(errorsConfig, function (ec) {

    var className = _.upperFirst(_.camelCase(ec.code)) + 'Error';
    errors[className] = function (_Error) {
      _inherits(_class, _Error);

      function _class(message, statusCode, code) {
        _classCallCheck(this, _class);

        var _this = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, message));

        _this.name = className;
        _this.statusCode = statusCode || ec.statusCode;
        _this.code = code || ec.code;
        return _this;
      }

      return _class;
    }(Error);
  });

  _.assign(global, errors);
};