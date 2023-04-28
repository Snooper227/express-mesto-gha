const router = require('express').Router();
const { NotFoundError } = require('../errors/NotFoundError');

const userRoutes = require('./users');
const cardRoutes = require('./cards');

router.use('/users', userRoutes);
router.use('/cards', cardRoutes);
router.use('*', () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});
router.use((req, res, err) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({ message: statusCode === 500 ? 'На сервере произошла ошибка!' : message });
});

module.exports = router;
