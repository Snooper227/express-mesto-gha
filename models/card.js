const mongoose = require('mongoose');
const validator = require('validator');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [2, 'Нужно хотя бы 2 символа.'],
    maxlength: [30, 'Максимальная длина — 30 символов.'],
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: { validator: (v) => validator.isURL(v) },
  },
  owner: {
    types: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: {
    type: [
      {
        types: mongoose.Schema.Types.ObjectId,
        ref: 'user',
      },
    ],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Card = mongoose.model('card', cardSchema);

module.exports = { Card };
