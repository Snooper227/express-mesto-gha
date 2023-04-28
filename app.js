const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const handleErrors = require('./middelwares/handleError');
const { auth } = require('./middelwares/auth');
const routes = require('./routes/index');
const routeSignin = require('./routes/signin');
const routeSignup = require('./routes/signup');
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

app.use(auth);

app.use('/', routeSignin);
app.use('/', routeSignup);
app.use('/', routes);

app.use((err, req, res) => {
  res.status(err.statusCode).send({ message: err.message });
});

app.use((req, res, next) => {
  next(new NotFoundError('Такой страницы не существует.'));
});

app.use(handleErrors);
app.use(errors());

app.listen(PORT, () => {
  console.log(`App open on port ${PORT}`);
});
