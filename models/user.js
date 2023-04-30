const mongoose = require('mongoose');
const validator = require('validator');

const bcrypt = require('bcryptjs');
const { UnauthorizationError } = require('../errors/UnauthorizationError');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: validator.isEmail,
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    name: {
      type: String,
      minLength: 2,
      maxLength: 30,
      default: 'Жак-Ив Кусто',
    },
    about: {
      type: String,
      minLength: 2,
      maxLength: 30,
      default: 'Исследователь',
    },
    avatar: {
      type: String,
      validate: { validator: (v) => validator.isURL(v) },
      default:
        'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    },
  },
  {
    versionKey: false,
    statics: {
      findUserByCredentials(email, password) {
        return this.findOne({ email })
          .select('+password')
          .then((user) => {
            if (!user) {
              throw new UnauthorizationError('Неправильная почта или пароль');
            }
            return bcrypt.compare(password, user.password).then((matched) => {
              if (!matched) {
                throw new UnauthorizationError('Неправильная почта или пароль');
              }
              return user;
            });
          });
      },
    },
  },
);
const User = mongoose.model('user', userSchema);
module.exports = { User };
