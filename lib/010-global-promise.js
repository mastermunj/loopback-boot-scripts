'use strict';

const _ = require('lodash');

export default (app) => {

  if(!BootScriptConfig.isEnabled('globalPromise')) {
    return;
  }

  global.Promise = require('bluebird');

};
