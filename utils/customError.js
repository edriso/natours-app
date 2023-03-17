class CustomAPIError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

    this.isOperational = true; // useful for testing later, to check if error was expected or not
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = CustomAPIError;
