'use strict';

const _ = require('lodash');

class Config {

  constructor(app) {
    this._app = app;
    this._config = app.get('bootScripts');
  }

  get(key, defaultValue = undefined) {
    return _.get(this._config, key, defaultValue);
  }

  isEnabled(key) {
    return !(
      // Can be disabled by setting false
      (_.hasIn(this._config, key) && this._config[key] === false) ||
      // OR by setting enabled = false within the config object
      (_.hasIn(this._config, [key, 'enabled']) && this._config[key]['enabled'] === false)
    );
  }
}

export default Config;
