const router = require('express').Router();

const userRoutes = require('./users');

router.use('/users', userRoutes);
router.use((req, res) => {
  res.status(404).send({ error: 'Что-то пошло не так'});
});
router.use('*', (req, res) => {
  res.status(constants.HTTP_STATUS_NOT_FOUND).send({ messege: 'По указанному url ничего нет'});
});

module.exports = router;