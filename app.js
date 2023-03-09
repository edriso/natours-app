const express = require('express');
const toursRouter = require('./routes/toursRoutes');

const app = express();

// Middleware
if (process.env.NODE_ENV === 'development') {
  const morgan = require('morgan');
  app.use(morgan('dev'));
}
app.use(express.json());

// Routes
app.use('/api/v1/tours', toursRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on port ${port}...`));
