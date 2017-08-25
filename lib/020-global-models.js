'use strict';

const _ = require('lodash');

export default (app) => {

  if(!BootScriptConfig.isEnabled('globalModels')) {
    return;
  }

  _.assign(global, app.models);

};
