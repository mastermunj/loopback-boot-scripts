'use strict';

import Config from './utils/config';

export default (app) => {

  global.BootScriptConfig = new Config(app);

  app.on('booted', () => {
    delete global.BootScriptConfig;
  });
}
