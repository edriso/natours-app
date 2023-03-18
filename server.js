require('dotenv').config();
const mongoose = require('mongoose');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT REJECTION! 💥');
  console.log(err);
  // process.exit(1); // becuz server now is in 'unclean state', in production there should be a tool to restart the server when crashed
});

const app = require('./app');

const port = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await mongoose
      .connect(process.env.MONGO_URL)
      .then(() => console.log('Connected to DB...'));

    app.listen(port, () => console.log(`Server is running on port ${port}...`));
  } catch (error) {
    console.log(error.name, error.message);
  }
};

startServer();

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥');
  console.log(err.name, err.message);
});
