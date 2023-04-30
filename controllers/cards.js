const { Card } = require('../models/card');
const { NotFoundError } = require('../errors/NotFoundError');
const { ForbiddenError } = require('../errors/ForbiddenError');
const { ValidationError } = require('../errors/ValidationError');

function createCard(req, res, next) {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
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
      if (card) return res.status(200).send(card);

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
  const { cardId } = req.params;
  const { userId } = req.user;

  Card.findByIdAndUpdate(
    cardId,
    {
      $pull: { likes: userId },
    },
    {
      new: true,
    },
  )
    .then((card) => {
      if (card) return res.status(200).send(card);

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
function getCards(req, res, next) {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => {
      next();
    });
}

const deleteCard = (req, res, next) => {
  const { id: cardId } = req.params;
  const { userId } = req.user;

  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) throw new NotFoundError('Данные по указанному id не найдены');

      const { owner: cardOwnerId } = card;
      if (cardOwnerId.valueOf() !== userId) throw new ForbiddenError('Нет прав доступа');

      card
        .remove()
        .then(() => res.send({ data: card }))
        .catch(next);
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
};

module.exports = {
  createCard,
  likeCard,
  dislikedCard,
  deleteCard,
  getCards,
};
