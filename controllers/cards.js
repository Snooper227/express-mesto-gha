const { Card } = require('../models/card');
const { NotFoundError } = require('../errors/NotFoundError');
const { ForbiddenError } = require('../errors/ForbiddenError');
const { ValidationError } = require('../errors/ValidationError');

function createCard(req, res, next) {
  const { name, link, owner = req.user._id } = req.body;
  Card.create({ name, link, owner })
    .then((card) => res.status(201).send({ card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
}

function likeCard(req, res, next) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {
      $addToSet: { likes: req.user._id },
    },
    {
      new: true,
    },
  )
    .then((card) => {
      if (card) return res.status(200).send({ card });

      throw new NotFoundError('Объект не найден');
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

function dislikedCard(req, res, next) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {
      $pull: { likes: req.user._id },
    },
    {
      new: true,
    },
  )
    .then((card) => {
      if (card) return res.status(200).send({ card });

      throw new NotFoundError('Объект не найден');
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные при снятии лайка'));
      } else if (err.name === 'CastError') {
        next(new ValidationError('Передан невалидный id'));
      } else if (err.statusCode === 404) {
        next(new NotFoundError(err.message));
      } else {
        next(err);
      }
    });
}
function getCards(_, res, next) {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send({ cards }))
    .catch(() => {
      next();
    });
}

function deleteCard(req, res, next) {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (card == null) {
        throw new NotFoundError('Карточка не найдена');
      } else if (String(card.owner) !== req.user._id) {
        throw new ForbiddenError('Доступ ограничен');
      } return Card.findByIdAndRemove(req.params.cardId)
        .then(() => {
          res.send({ message: 'Карточка удалена!' });
        });
    })
    .catch(next);
}

module.exports = {
  createCard,
  likeCard,
  dislikedCard,
  deleteCard,
  getCards,
};
