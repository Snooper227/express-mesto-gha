const { User } = require('../models/user');
const StatusCode = require('../utils/constans-error');

function createUser(req, res) {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(StatusCode.BAD_REQUEST)
          .send({
            message: 'Переданы некорректные данные при создании профиля',
          });
      } else {
        res.status(StatusCode.DEFAULT).send({ message: 'Произошла ошибка' });
      }
    });
}

function getUser(req, res) {
  User.findById(req.params.id)
    .orFail(() => {
      const error = new Error('Пользовател с таким id не найден');
      error.statusCode = StatusCode.NOT_FOUND;
      throw error;
    })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(StatusCode.BAD_REQUEST).send({ message: 'Передан невалидный id' });
      } else if (err.statusCode === 404) {
        res.status(StatusCode.NOT_FOUND).send({ message: err.message });
      } else {
        res.status(StatusCode.DEFAULT).send({ message: 'Произошла ошибка' });
      }
    });
}

function getUsers(req, res) {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch(() => {
      res.status(StatusCode.DEFAULT).send({ message: 'Произошла ошибка' });
    });
}

function getCurrentUserInfo(req, res) {
  User.findById(req.user._id)
    .orFail(() => {
      const error = new Error('Пользователь с таким id не найден');
      error.statusCode = StatusCode.NOT_FOUND;
      throw error;
    })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(StatusCode.BAD_REQUEST).send({ message: 'Передан невалидный id' });
      } else if (err.statusCode === 404) {
        res.status(StatusCode.NOT_FOUND).send({ message: err.message });
      } else {
        res.status(StatusCode.DEFAULT).send({ message: 'Произошла ошибка' });
      }
    });
}

function updateUser(req, res) {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .orFail(() => {
      const error = new Error('Пользователь с таким id не найден');
      error.statusCode = StatusCode.NOT_FOUND;
      throw error;
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(StatusCode.BAD_REQUEST)
          .send({
            message: 'Переданы некорректные данные при обновлении профиля',
          });
      } else if (err.name === 'CastError') {
        res.status(StatusCode.BAD_REQUEST).send({ message: 'Передан невалидный id' });
      } else if (err.statusCode === 404) {
        res.status(StatusCode.NOT_FOUND).send({ message: err.message });
      } else {
        res.status(StatusCode.DEFAULT).send({ message: 'Произошла ошибка' });
      }
    });
}

function updateAvatar(req, res) {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => {
      const error = new Error('Пользователь с таким id не найден');
      error.statusCode = StatusCode.NOT_FOUND;
      throw error;
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(StatusCode.BAD_REQUEST)
          .send({
            message: 'Переданы некорректные данные при обновлении аватара',
          });
      } else if (err.name === 'CastError') {
        res.status(StatusCode.BAD_REQUEST).send({ message: 'Передан невалидный id' });
      } else if (err.statusCode === 404) {
        res.status(StatusCode.NOT_FOUND).send({ message: err.message });
      } else {
        res.status(StatusCode.DEFAULT).send({ message: 'Произошла ошибка' });
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
};
