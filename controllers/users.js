const { User } = require('../models/user');
const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundError');

function createUser(req, res, next) {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'validationError') {
        next(new ValidationError('Переданы некорректные данные при создании профиля'))
      } else {
        next(err);
      }
    });
}

function getUser(req, res, next) {
  User.findById(req.params.id)
    .then((user) => {
      res.status(200).send(user)
    })
    .catch((err) => {
      if (err.name === 'validationError') {
        next(new NotFoundError('Пользователь не найден'))
      } else {
        next(err);
      }
    });
}

function getUsers(req, res, next) {
  User.find({})
    .then((users) => res.status(200).send({
      _id: users._id,
      name: users.name,
      about: users.about,
      avatar: users.avatar
    }))
    .catch((err) => {
      if (err.name === 'validationError') {
        next(new NotFoundError('Пользователи не найдены'))
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
  .catch((err) => {ё
    next(err);
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
  .catch((err) => {ё
    next(err);
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
  .catch((err) => {ё
    next(err);
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
