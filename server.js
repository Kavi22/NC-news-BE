if (!process.env.NODE_ENV) process.env.NODE_ENV = 'dev';

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const {apiRouter} = require('./routers/api');
const config = require('./config');
const db = config.DB[process.env.NODE_ENV] || process.env.DB;
const PORT = config.PORT[process.env.NODE_ENV] || process.env.PORT;
mongoose.Promise = Promise;

mongoose.connect(db, () => {
  console.log('connected to db!');
  console.log('db: ' + db);
});

app.use(bodyParser.json());

app.use(cors());

app.get('/', function (req, res) {
  res.status(200).send('All good!');
});

app.use('/api', apiRouter);

app.use((err, req, res, next) => {
  if (!err.status) return next(err);
  return res.status(err.status).send({ msg: err.msg });
});

// app.use((err, req, res) => {
//   res.status(500).send({ err });
// });

app.listen(PORT, function () {
  console.log(`listening on port ${PORT}`);
});

module.exports = app;
