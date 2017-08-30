'use strict';

export default (app) => {

  if(!BootScriptConfig.isEnabled('currentUser')) {
    return;
  }

  let key = BootScriptConfig.get(['currentUser', 'key'], 'currentUser');
  let model = BootScriptConfig.get(['currentUser', 'model'], 'User');

  if(!app.models[model]) {
    throw new Error('Invalid model name `' + model + '`');
  }

  app.remotes().phases
    .addBefore('invoke', 'options-from-request')
    .use((ctx, next) => {

      if (!ctx.args.options || !ctx.args.options.accessToken) {
        return next();
      }

      app.models[model].findById(ctx.args.options.accessToken.userId)
        .then(user => {
          ctx.args.options[key] = user;
          next();
        })
        .catch(e => {
          next(e);
        });
    });
};
