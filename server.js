if (!process.env.NODE_ENV) process.env.NODE_ENV = 'dev';

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const {apiRouter} = require('./routers/api');
const config = require('./config');
const db = config.DB[process.env.NODE_ENV] || process.env.DB;
const PORT = config.PORT[process.env.NODE_ENV] || process.env.PORT;
mongoose.Promise = Promise;

mongoose.connect(db, () => {
  console.log('connected to db');
});

app.use(bodyParser.json());
app.get('/', function (req, res) {
  res.status(200).send('All good!');
});

app.use('/api', apiRouter);

app.listen(PORT, function () {
  console.log(`listening on port ${PORT}`);
});

module.exports = app;
