const CustomAPIError = require('../utils/customError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new CustomAPIError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  // const key = Object.keys(err.keyValue)[0];
  // const value = Object.values(err.keyValue)[0];
  const [key, value] = Object.entries(err.keyValue)[0];
  const message = `Duplicate field ${key}, ${value} already used.`;
  return new CustomAPIError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors)
    .map((e) => e.message)
    .join(', ');

  const message = `Invalid input data: ${errors}.`;
  return new CustomAPIError(message, 400);
};

const sendError = (err, res) => {
  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack,
    });
  } else if (err.isOperational) {
    // Operational, known errors: send message to client
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Programming or unknown errors: don't leak error details and send generic message
    console.error('ERROR:', err);

    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    });
  }
};

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  let error = { ...err };
  // Handling mongoose errors
  if (err.name === 'CastError') {
    error = handleCastErrorDB(error);
  } else if (error.code === 11000) {
    error = handleDuplicateFieldsDB(error);
  } else if (error._message === 'Validation failed') {
    error = handleValidationErrorDB(error);
  }

  sendError(error, res);
};

module.exports = errorHandler;
