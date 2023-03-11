require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

const port = process.env.PORT || 3000;

// eslint-disable-next-line no-console
mongoose.connect(process.env.MONGO_URL).then(console.log('Connected to DB...'));
// eslint-disable-next-line no-console
app.listen(port, () => console.log(`Server is running on port ${port}...`));
