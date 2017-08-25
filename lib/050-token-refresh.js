'use strict';

export default (app) => {

  if(!BootScriptConfig.isEnabled('tokenRefresh')) {
    return;
  }

  let onceIn = BootScriptConfig.get(['tokenRefresh', 'onceIn'], 86400);
  let ttl = BootScriptConfig.get(['tokenRefresh', 'ttl'], 86400 * 30);

  app.use((req, res, next) => {

    let token = req.accessToken;
    if (!token) {
      return next();
    }

    let now = new Date();
    if ((now.getTime() - token.created.getTime()) < onceIn) {
      return next();
    }

    token.created = now;
    token.ttl = ttl;
    token.save(next);
  });
};
