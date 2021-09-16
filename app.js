const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');
const bodyParser = require('body-parser');
const offerRouter = require('./routes/offerRouter');
var path = require('path');

mongoose.connect(config.db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log(`we're connected!`);
  app.emit('ready');
});

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', offerRouter);

app.on('ready', () => {
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
});
