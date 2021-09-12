const express = require('express');
const { pullAll, showAll, showOne } = require('./controlers/offerControlers');
const mongoose = require('mongoose');
const config = require('./config');
const bodyParser = require('body-parser');
const startScrape = require('./index');

mongoose.connect(config.db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log(`we're connected!`);
});

const app = express();
const port = 3000;

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get('/', (req, res) => {
  res.send('Hello');
});

app.post('/pull', pullAll);

app.get('/offers', showAll);

app.get('/offers/:id', showOne);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
