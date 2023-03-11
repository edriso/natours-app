require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await mongoose
      .connect(process.env.MONGO_URL)
      .then(() => console.log('Connected to DB...'));

    app.listen(port, () => console.log(`Server is running on port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
