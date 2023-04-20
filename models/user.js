const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: [2, 'Минимальное количество букв в имени - 2'],
    maxLength: [30, 'Минимальное количество букв в имени - 30'],
  },
  about: {
    type: String,
    required: true,
    minLength: [2, 'Минимальное количество букв в имени - 2'],
    maxLength: [30, 'Минимальное количество букв в имени - 30'],
  },
  avatar: {
    type: String,
    required: true,
    validate: { validator: (v) => validator.isURL(v) },
  },
}, { versionKey: false });
const User = mongoose.model('user', userSchema);
module.exports = { User };
