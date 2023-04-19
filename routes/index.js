const router = require('express').Router();
const NotFoundError = require('../errors/NotFoundError');

const userRoutes = require('./users');
const cardRoutes = require('./cards');

router.use('/users', userRoutes);
router.use('/cards', cardRoutes);
router.use((req, res) => {
  res.status(404).send({ error: 'Что-то пошло не так'});
});
router.use('*', () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

module.exports = router;