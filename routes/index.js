const router = require('express').Router();

const userRoutes = require('./users');

router.use('/users', userRoutes);
router.use((req, res) => {
  res.status(404).send({ error: 'Что-то пошло не так'});
});

module.exports = router;