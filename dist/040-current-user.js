'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (app) {

  if (!BootScriptConfig.isEnabled('currentUser')) {
    return;
  }

  var key = BootScriptConfig.get(['currentUser', 'key'], 'currentUser');
  var model = BootScriptConfig.get(['currentUser', 'model'], 'User');

  if (!app.models[model]) {
    throw new Error('Invalid model name `' + model + '`');
  }

  app.remotes().phases.addBefore('invoke', 'options-from-request').use(function (ctx, next) {

    if (!ctx.args.options || !ctx.args.options.accessToken) {
      return next();
    }

    app.models[model].findById(ctx.args.options.accessToken.userId).then(function (user) {
      ctx.args.options[key] = user;
      next();
    }).catch(function (e) {
      next(e);
    });
  });
};