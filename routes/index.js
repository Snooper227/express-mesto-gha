const router = require('express').Router();
const NotFoundError = require('../errors/NotFoundError');
const StatusCode = require('../utils/constans-error');

const userRoutes = require('./users');
const cardRoutes = require('./cards');

router.use('/users', userRoutes);
router.use('/cards', cardRoutes);
router.use((req, res) => {
  res.status(StatusCode.NOT_FOUND).send({ message: 'Что-то пошло не так' });
});
router.use('*', () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

module.exports = router;
