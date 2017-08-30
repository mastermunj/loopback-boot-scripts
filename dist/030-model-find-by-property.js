'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _ = require('lodash');
var dsUtils = require('loopback-datasource-juggler/lib/utils');
var mergeQuery = dsUtils.mergeQuery;

exports.default = function (app) {

  if (!BootScriptConfig.isEnabled('findByProperty')) {
    return;
  }

  var enableFind = BootScriptConfig.get(['findByProperty', 'find']);
  enableFind = enableFind === true || enableFind === undefined;
  var enableFindOne = BootScriptConfig.get(['findByProperty', 'findOne']);
  enableFindOne = enableFindOne === true || enableFindOne === undefined;

  if (!enableFind && !enableFindOne) {
    return;
  }

  _.each(app.models, function (model) {

    var properties = getProperties(model);

    var methods = getMethods(model);

    if (enableFind) {
      var findMethods = getFindMethods(properties);

      var findDifference = _.difference(findMethods, methods);
      _.each(findDifference, function (method) {
        var property = _.camelCase(_.replace(method, 'findBy', ''));
        addFindMethod(model, property, method);
      });
    }

    if (enableFindOne) {
      var findOneMethods = getFindOneMethods(properties);

      var findOneDifference = _.difference(findOneMethods, methods);
      _.each(findOneDifference, function (method) {
        var property = _.camelCase(_.replace(method, 'findOneBy', ''));
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

    one = one === true;

    model[method] = function (value, filter, options, cb) {
      if (options === undefined && cb === undefined) {
        if (typeof filter === 'function') {
          cb = filter;
          filter = {};
        }
      } else if (cb === undefined) {
        if (typeof options === 'function') {
          cb = options;
          options = {};
          if ((typeof filter === 'undefined' ? 'undefined' : _typeof(filter)) === 'object' && !(filter.include || filter.fields)) {
            // If filter doesn't have include or fields, assuming it's options
            options = filter;
            filter = {};
          }
        }
      }

      options = options || {};
      filter = filter || {};
      var query = { where: {} };
      query.where[property] = value;
      query = mergeQuery(query, filter);
      if (!cb) {
        return model[one ? 'findOne' : 'find'].call(model, query, options);
      }
      return model[one ? 'findOne' : 'find'].call(model, query, options, cb);
    };
  }
};