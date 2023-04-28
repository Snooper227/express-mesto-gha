const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const routes = require('./routes/index');
const routeSignin = require('./routes/signin');
const routeSignup = require('./routes/signup');
const errorHandle = require('./middelwares/errorHandle');

const app = express();

const { PORT = 3000 } = process.env;
const BASE_PATH = 'mongodb://localhost:27017/mestodb';

mongoose.connect(BASE_PATH, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', routeSignin);
app.use('/', routeSignup);
app.use('/', routes);
app.use(errors());
app.use(errorHandle);

app.listen(PORT, () => {
  console.log(`App open on port ${PORT}`);
});
