const { Card } = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');

function createCard(req, res) {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner})
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

  Card.findByIdAndUpdate(
    req.params.cardId,
    {
      $addToSet: { likes: req.user._id },
    },
    {
      new: true,
    },
  )
    .populate(['likes'])
    .then((card) => {
      if(card) return res.status(200).send(card)

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
      if (card) return res.status(200).send(card)

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

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (card) return res.status(200).send(card);

      throw new NotFoundError('Объект не найден');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Передан невалидный id'});
      } else if (err.statusCode === 404) {
        res.status(404).send({ message: err.message });
      } else {
        res.status(500).send({ message: 'Произошла ошибка'});
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
