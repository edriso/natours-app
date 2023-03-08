const express = require('express');
const toursRouter = require('./routes/toursRoutes');

const app = express();

app.use(express.json());

app.use('/api/v1/tours', toursRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on port ${port}...`));
