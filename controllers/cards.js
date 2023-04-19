const { Card } = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');

function createCard(req, res) {
  const { name, link } = req.body;
  const { userId } = req.user;
  Card.create({ name, link, owner: userId })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({message: 'Переданы некорректные данные при создании карточки'});
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Передан невалидный id'});
      } else if (err.statusCode === 404) {
        res.status(404).send({ message: err.message });
      } else {
        res.status(500).send({ message: 'Произошла ошибка'});
      }
    });
}

function likeCard(req, res) {
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
    .populate(['likes'])
    .then((card) => {
      if(card) return res.send(card)

      throw new NotFoundError('Объект не найден');
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({message: 'Переданы некорректные данные при лайке карточки'});
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Передан невалидный id'});
      } else if (err.statusCode === 404) {
        res.status(404).send({ message: err.message });
      } else {
        res.status(500).send({ message: 'Произошла ошибка'});
      }
    });
}

function dislikedCard(req, res) {
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
      if (card) return res.send(card)

    throw new NotFoundError('Объект не найден');
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({message: 'Переданы некорректные данные при снятии лайка'});
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Передан невалидный id'});
      } else if (err.statusCode === 404) {
        res.status(404).send({ message: err.message });
      } else {
        res.status(500).send({ message: 'Произошла ошибка'});
      }
    });
}
function getCards(req, res, next) {
  Card.find({})
    .populate(['owner'])
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
