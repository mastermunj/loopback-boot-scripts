# Loopback Boot Scripts

## Introduction

Loopback Boot Scripts is collection of useful boot scripts for Loopback framework.

Each boot script can be individually enabled / disabled and also it's behavior can be configured to an extent.


## Installation

```js
npm install loopback-boot-scripts --save
```

OR

```js
yarn add loopback-boot-scripts
```


Modify `server.js` file as below. This will make the boot-scripts files run first and then boot files in the `server/boot` directory.

```js
let bootOptions = {
  'appRootDir': __dirname,
  'bootDirs': [
    './node_modules/loopback-boot-scripts/dist/'
  ]
};

...


boot(app, bootOptions, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
```

## Boot Scripts



### Custom Errors

Inspired from [https://gist.github.com/justmoon/15511f92e5216fa2624b](https://gist.github.com/justmoon/15511f92e5216fa2624b).

Creates Error classes for various HTTP error codes as default Node.js Error class does not capture statusCode and code.

#### Configuration

```js
"bootScripts": {
  "customErrors": {
    "errors": [
      {"statusCode": 400, "code": "BAD_REQUEST"}
    ],
    "mode": "merge"
  }
}
```

In above example, a new class `BadRequestError` will be created with default `statusCode=400` and `code=BAD_REQUEST`.

`mode` parameter can have a truthy value `merge` or anything else as falsy.
If mode = `merge` i.e. truthy, errors given with config will be merged with default errors in [errors.json](./lib/utils/errors.json), else default errors will be overwritten.


### Global Promise

Simply replaces native Promise with bluebird Promise.


### Global Models

Accessing models within loopback can be tedious at times. This boot script simply brings all models to global scope for easy reference.


### Find By Property

Adds `findBy{Property}` and `findOneBy{Property}` methods to models.

e.g.

```js
{
  "name": "Contact",
  "base": "PersistedModel",
  "idInjection": true,
  "properties": {
    "name": {
      "type": "string"
    },
    "mobile": {
      "type": "string"
    },
    "email": {
      "type": "string"
    }
  }
}
```

For the above model, following new methods will be added.

```js
Contact.findByName
Contact.findByMobile
Contact.findByEmail

Contact.findOneByName
Contact.findOneByMobile
Contact.findOneByEmail
```

Please note that since `findById` method already exists, it won't be overwritten. In that sense, if any of the dynamic generated method already exists in model, it won't be overwritten.

#### Configuration

In case if either `find` or `findOne` methods are not required, they can be disabled with following config.


```js
"bootScripts": {
  "findByProperty": {
    "find": false,
    "findOne": false
  }
}
```


### Current User

Adds a user instance into context accessible at `ctx.args.options.[KEY]` where `[KEY]` defaults to `currentUser` but can also be configured.

User model is also configurable.

#### Configuration

```js
"bootScripts": {
  "currentUser": {
    "key": "user",
    "model": "CustomUser"
  }
}
```

### Token Refresh

A general use case is where token needs to expire after certain days of last access. This requires refreshing token expiry after every access.

Refreshing the token in every request is also costly, thus this boot script takes care of refreshing token `onceIn` specified time frame by given `ttl`.


#### Configuration

```js
"bootScripts": {
  "tokenRefresh": {
    "onceIn": 86400 * 2,
    "ttl": 86400 * 7
  }
}
```

Above config will refresh token once in 2 days and will set ttl as 7 days.


## Enable / Disable

Each boot script is by default enabled. Need be, it can be disabled by either of following ways.

Let's disable Custom Errors for example.
```js
"bootScripts": {
  "customErrors": false
}
```
OR
```js
"bootScripts": {
  "customErrors": {
    "enabled": false
  }
}
```

