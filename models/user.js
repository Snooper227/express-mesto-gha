const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Поле имя должно быть заполнено'],
    minLength: [2, 'Минимальное количество букв в имени - 2'],
    maxLength: [30, 'Минимальное количество букв в имени - 30'],
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    required: [true, 'Укажите информацию о себе'],
    minLength: [2, 'Минимальное количество букв в имени - 2'],
    maxLength: [30, 'Минимальное количество букв в имени - 30'],
    default: 'Исследователь океана',
  },
  avatar: {
    type: String,
    required: [true, 'Добавьте аватар'],
    default:
      'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: { validator: (v) => validator.isURL(v) },
  },
});
const User = mongoose.model('user', userSchema);;
module.exports = { User };
