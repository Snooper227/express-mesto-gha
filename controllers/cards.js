const Card = require('../models/card');
const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundError');

function createCard(req, res, next) {
  const { name, link } = req.body;
  const { userId } = req.user;
  Card.create({ name, link, owner: userId })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'validationError') {
        next(new ValidationError('Переданы некорректные данные при создании карточки'))
      } else {
        next(err);
      }
    });
}

function likeCard(req, res, next) {
  const { cardId } = req.params;
  const { userId } = req.user;

  Card.findByIdAndUpdate(
    cardId,
    {
      $addToSet: { likes: userId },
    },
    {
      new: true,
    },
  )
    .then((card) => {
      if(card) return res.send({ data: card })
      throw new NotFoundError('Объект не найден');
    })
    .catch((err) => {
      if (err.name === 'validationError') {
        next(new ValidationError('Переданы некорректные данные при создании карточки'))
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
      if (card) return res.send({ data: card })

    throw new NotFoundError('Объект не найден');
    })
    .catch((err) => {
      if (err.name === 'validationError') {
        next(new ValidationError('Переданы некорректные данные при снятии лайка карточки'))
      } else {
        next(err);
      }
    });
}
function getCards(req, res, next) {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
}

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => console.log('Карточка не найдена.'))
    .then((card) => {
      if (JSON.stringify(card.owner) !== JSON.stringify(req.user.payload)) {
        return next(console.log('Нельзя удалять чужие карточки.'));
      }
      return card.remove()
        .then(() => res.send({ message: 'Карточка удалена.' }));
    })
    .catch(next);
};

module.exports = {
  createCard,
  likeCard,
  dislikedCard,
  deleteCard,
  getCards,
};
