'use strict';

const _ = require('lodash');
const dsUtils = require('loopback-datasource-juggler/lib/utils');
const mergeQuery = dsUtils.mergeQuery;

export default (app) => {

  if(!BootScriptConfig.isEnabled('findByProperty')) {
    return;
  }

  let enableFind = BootScriptConfig.get(['findByProperty', 'find']);
  enableFind = (enableFind === true || enableFind === undefined);
  let enableFindOne = BootScriptConfig.get(['findByProperty', 'findOne']);
  enableFindOne = (enableFindOne === true || enableFindOne === undefined);

  if(!enableFind && !enableFindOne) {
    return;
  }

  _.each(app.models, model => {

    let properties = getProperties(model);

    let methods = getMethods(model);

    if(enableFind) {
      let findMethods = getFindMethods(properties);

      let findDifference = _.difference(findMethods, methods);
      _.each(findDifference, method => {
        let property = _.camelCase(_.replace(method, 'findBy', ''));
        addFindMethod(model, property, method);
      });
    }

    if(enableFindOne) {
      let findOneMethods = getFindOneMethods(properties);

      let findOneDifference = _.difference(findOneMethods, methods);
      _.each(findOneDifference, method => {
        let property = _.camelCase(_.replace(method, 'findOneBy', ''));
        addFindMethod(model, property, method, true);
      });
    }

  });

  function getMethods(model) {
    return _.map(model.sharedClass.methods(), function (method) {
      return method.name;
    });
  }

  function getProperties(model) {
    return _.keys(model.definition.properties);
  }

  function getFindMethods(properties) {
    return _.map(properties, function (property) {
      return _.camelCase('findBy_' + property);
    });
  }

  function getFindOneMethods(properties) {
    return _.map(properties, function (property) {
      return _.camelCase('findOneBy_' + property);
    });
  }

  function addFindMethod(model, property, method, one) {

    one = (one === true);

    model[method] = (value, filter, options, cb) => {
      if (options === undefined && cb === undefined) {
        if (typeof filter === 'function') {
          cb = filter;
          filter = {};
        }
      } else if (cb === undefined) {
        if (typeof options === 'function') {
          cb = options;
          options = {};
          if (typeof filter === 'object' && !(filter.include || filter.fields)) {
            // If filter doesn't have include or fields, assuming it's options
            options = filter;
            filter = {};
          }
        }
      }

      options = options || {};
      filter = filter || {};
      let query = {where: {}};
      query.where[property] = value;
      query = mergeQuery(query, filter);
      if(!cb) {
        return model[one ? 'findOne': 'find'].call(model, query, options);
      }
      return model[one ? 'findOne': 'find'].call(model, query, options, cb);
    }
  }
};
