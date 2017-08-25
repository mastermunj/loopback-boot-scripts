'use strict';

class CustomError extends Error {

  constructor (message, statusCode, code) {

    super(message);

    // Saving class name in the property of our custom error as a shortcut.
    this.name = this.constructor.name;

    this.statusCode = statusCode || 500;

    this.code = code || 'INTERNAL_SERVER_ERROR';

  }
}

export default CustomError;
