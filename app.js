const express = require('express');
const morgan = require('morgan');
const toursRouter = require('./routes/toursRoutes');
const usersRouter = require('./routes/usersRoutes');
const CustomAPIError = require('./utils/customError');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// Routes
app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', usersRouter);

app.all('*', (req, res, next) => {
  // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  // err.statusCode = 404;
  // err.status = 'fail';

  const err = new CustomAPIError(
    `Can't find ${req.originalUrl} on this server!`,
    404
  );

  next(err);
});

app.use(errorHandler);

module.exports = app;
