const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/index');
const bodyParser = require('body-parser');
const NotFoundError = require('./errors/NotFoundError');

const app = express();

const { PORT = 3000 } = process.env;
const BASE_PATH = 'mongodb://localhost:27017/mestodb';

mongoose.connect(BASE_PATH, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  req.user = {
    _id: '643fd732ef900c0093cbba48',
  };

  next();
});
app.use('/', routes);


app.use('*', () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

app.listen(PORT, () => {
  console.log(`App open on port ${PORT}`);
});
