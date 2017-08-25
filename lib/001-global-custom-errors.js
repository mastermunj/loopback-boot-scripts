'use strict';

import CustomError from './utils/custom-error';

const _ = require('lodash');

export default (app) => {

  if(!BootScriptConfig.isEnabled('customErrors')) {
    return;
  }

  let config = BootScriptConfig.get('customErrors');
  let errorsConfig = require('./utils/errors.json');
  if(config && config.errors) {
    let mode = config.mode || 'merge';
    if(mode === 'merge') {
      errorsConfig = _.merge(
        _.keyBy(errorsConfig, 'statusCode'),
        _.keyBy(config.errors, 'statusCode')
      );
    } else {
      errorsConfig = config.errors;
    }
  }

  let errors = {
    CustomError: CustomError
  };
  _.each(errorsConfig, (ec) => {

    let className = _.upperFirst(_.camelCase(ec.code)) + 'Error';
    errors[className] = (class extends Error {

      constructor (message, statusCode, code) {

        super(message);
        this.name = className;
        this.statusCode = statusCode || ec.statusCode;
        this.code = code || ec.code;
      }
    });
  });

  _.assign(global, errors);

};
