const { User } = require('../models/user');
const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundError');

function createUser(req, res, next) {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные при создании профиля'));
      } else {
        next(err);
      }
    });
}

function getUser(req, res, next) {
  User.findById(req.params.id)
    .then((user) => {
      if (user) res.send(user)

      throw new NotFoundError('Пользователь с таким id не найден');
    })
    .catch((err) => {
      if (err.name === 'validationError') {
        next (new ValidationError('Передан некорректный id'));
      }
    });
}

function getUsers(req, res, next) {
  User.find({})
    .then((users) => res.status(200).send({ users }))
    .catch((err) => {
      if (err.name === 'validationError') {
        next(new NotFoundError('Пользователи не найдены'));
        return;
      } else {
        next(err);
      }
    });
}

function getCurrentUserInfo(req, res, next) {
  User.findById(req.user.payload)
  .then((user) => {
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    } else {
      res.send(user)
    }
  })
  .catch((err) => {
    if (err.name === 'validationError') {
      next( new ValidationError('Передан некорректный id'))
    } else {
      next(err);
    }
  })
}

function updateUser(req, res, next) {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user.payload, { name, about },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
  .then((user) => {
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    } else {
      res.send(user)
    }
  })
  .catch((err) => {
    if (err.name === 'ValidationError') {
      next( new ValidationError('Переданы некорректные данные при обновлении профиля пользователя'))
    } else {
      next(err);
    }
  })
}

function updateAvatar(req, res, next) {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user.payload, { avatar },
    {
      new: true,
      runValidators: true
    },
  )
  .then((user) => {
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    } else {
      res.send(user)
    }
  })
  .catch((err) => {
    if (err.name === 'ValidationError') {
      next( new ValidationError('Переданы некорректные данные при обновлении профиля пользователя'))
    } else {
      next(err);
    }
  })
}

module.exports = {
  getUser,
  getUsers,
  createUser,
  getCurrentUserInfo,
  updateAvatar,
  updateUser
};
