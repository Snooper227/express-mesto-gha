const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/index');
const bodyParser = require('body-parser');

const app = express();

const { PORT = 3000 } = process.env;
const BASE_PATH = 'mongodb://localhost:27017/mestodb';


mongoose.connect(BASE_PATH);

app.use(bodyParser.json());
app.use(routes);
app.use((req, res, next) => {
  req.user = {
    _id: '643ee47b02536e71c2a602c0',
  };

  next();
});

app.listen(PORT, () => {
  console.log(`App open on port ${PORT}`);
});
