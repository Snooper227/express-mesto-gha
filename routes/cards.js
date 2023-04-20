const routesCards = require('express').Router();

const {
  createCard,
  likeCard,
  dislikedCard,
  deleteCard,
  getCards,
} = require('../controllers/cards');

routesCards.delete('/:cardId', deleteCard);
routesCards.post('/', createCard);
routesCards.delete('/:cardId/likes', dislikedCard);
routesCards.put('/:cardId/likes', likeCard);
routesCards.get('/', getCards);

module.exports = routesCards;
