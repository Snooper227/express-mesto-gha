const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

const { User } = require('../models/user');
const { NotFoundError } = require('../errors/NotFoundError');
const { ConflictError } = require('../errors/ConflictError');
const { ValidationError } = require('../errors/ValidationError');

function createUser(req, res, next) {
  const {
    email,
    password,
    name,
    about,
    avatar,
  } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    }))
    .then((user) => {
      const { _id } = user;

      return res.status(201).send({
        email,
        name,
        about,
        avatar,
        _id,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким электронным адресом уже зарегистрирован'));
      } else if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные при регистрации пользователя'));
      } else {
        next(err);
      }
    });
}

function loginUser(req, res, next) {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key', { expiresIn: '7d' });
      res.status(201).cookie('authorization', token, { maxAge: 3600000 * 24 * 7, httpOnly: true }).send({ message: 'Athorization successful' });
    })
    .catch(next);
}

function getUser(req, res, next) {
  const { _id } = req.params;

  User.findById({ _id })
    .orFail(() => {
      const error = new Error('Пользовател с таким id не найден');
      error.statusCode = 404;
      throw error;
    })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Передан невалидный id'));
      } else if (err.statusCode === 404) {
        next(new NotFoundError(err.message));
      } else {
        next();
      }
    });
}

function getUsers(req, res, next) {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch(() => {
      next();
    });
}

function getCurrentUserInfo(req, res, next) {
  const { userId } = req.user;
  User.findById(userId)
    .orFail(() => {
      const error = new Error('Пользователь с таким id не найден');
      error.statusCode = 404;
      throw error;
    })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Передан невалидный id'));
      } else if (err.statusCode === 404) {
        next(new NotFoundError(err.message));
      } else {
        next(err);
      }
    });
}

function updateUser(req, res, next) {
  const { name, about } = req.body;
  const { userId } = req.user;

  User.findByIdAndUpdate(
    userId,
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .orFail(() => {
      const error = new Error('Пользователь с таким id не найден');
      error.statusCode = 404;
      throw error;
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные при обновлении профиля'));
      } else if (err.name === 'CastError') {
        next(new ValidationError('Передан невалидный id'));
      } else if (err.statusCode === 404) {
        next(new NotFoundError(err.message));
      } else {
        next(err);
      }
    });
}

function updateAvatar(req, res, next) {
  const { avatar } = req.body;
  const { userId } = req.user;

  User.findByIdAndUpdate(
    userId,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => {
      const error = new Error('Пользователь с таким id не найден');
      error.statusCode = 404;
      throw error;
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные при обновлении аватара'));
      } else if (err.name === 'CastError') {
        next(new ValidationError('Передан невалидный id'));
      } else if (err.statusCode === 404) {
        next(new NotFoundError(err.message));
      } else {
        next(err);
      }
    });
}

module.exports = {
  getUser,
  getUsers,
  createUser,
  getCurrentUserInfo,
  updateAvatar,
  updateUser,
  loginUser,
};
