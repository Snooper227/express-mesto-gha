const router = require('express').Router();
const auth = require('../middelwares/auth');
const { NotFoundError } = require('../errors/NotFoundError');

const userRoutes = require('./users');
const cardRoutes = require('./cards');

router.use('/users', auth, userRoutes);
router.use('/cards', auth, cardRoutes);
router.use('*', () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

module.exports = router;
