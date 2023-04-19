const { User } = require('../models/user');

function createUser(req, res) {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({message: 'Переданы некорректные данные при создании профиля'});
      } else if (err.statusCode === 404) {
        res.status(404).send({ message: err.message });
      } else {
        res.status(500).send({ message: 'Произошла ошибка'});
      }
    });
}

function getUser(req, res) {
  User.findById(req.params.id)
    .then((user) => {
      if(user) return res.status(200).send(user);

      throw new NotFoundError('Пользователь не найден');
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({message: 'Запрашиваемый пользователь не найден'});
      } else if (err.name === 'CastError') {
        res.status(400).send({message: 'Передан невалидный id'});
      } else if (err.statusCode === 404) {
        res.status(404).send({ message: err.message });
      } else {
        res.status(500).send({ messsage: 'Произошла ошибка'});
      }
    });
}

function getUsers(req, res) {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({message: 'Запрашиваемые пользователи не найдены'});
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Передан невалидный id'});
      } else if (err.statusCode === 404) {
        res.status(404).send({ message: err.message });
      } else {
        res.status(500).send({ message: 'Произошла ошибка'});
      }
    });
}

function getCurrentUserInfo(req, res) {
  User.findById(req.user._id)
  .orFail(() => {
    const error = new Error('Пользователь с таким id не найден');
      error.statusCode = 404;
      throw error;
  })
  .then((user) => {
    res.send(user)
  })
  .catch((err) => {
    if (err.name === 'ValidationError') {
      res.status(400).send({message: 'Пользователь не найден'});
    } else if (err.name === 'CastError') {
      res.status(400).send({ message: 'Передан невалидный id'});
    } else if (err.statusCode === 404) {
      res.status(404).send({ message: err.message });
    } else {
      res.status(500).send({ message: 'Произошла ошибка'});
    }
  });
}

function updateUser(req, res) {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id, { name, about },
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
      res.send(user)
  })
  .catch((err) => {
    if (err.name === 'ValidationError') {
      res.status(400).send({message: 'Переданы некорректные данные при обновлении профиля'});
    } else if (err.name === 'CastError') {
      res.status(400).send({ message: 'Передан невалидный id'});
    } else if (err.statusCode === 404) {
      res.status(404).send({ message: err.message });
    } else {
      res.status(500).send({ message: 'Произошла ошибка'});
    }
  });
}

function updateAvatar(req, res) {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id, { avatar },
    {
      new: true,
      runValidators: true
    },
  )
  .orFail(() => {
    const error = new Error('Пользователь с таким id не найден');
    error.statusCode = 404;
    throw error;
  })
  .then((user) => {
    res.send(user)
  })
  .catch((err) => {
    if (err.name === 'ValidationError') {
      res.status(400).send({message: 'Переданы некорректные данные при обновлении аватара'});
    } else if (err.name === 'CastError') {
      res.status(400).send({ message: 'Передан невалидный id'});
    } else if (err.statusCode === 404) {
      res.status(404).send({ message: err.message });
    } else {
      res.status(500).send({ message: 'Произошла ошибка'});
    }
  });
}

module.exports = {
  getUser,
  getUsers,
  createUser,
  getCurrentUserInfo,
  updateAvatar,
  updateUser
};
