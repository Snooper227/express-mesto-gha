const routesUsers = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  createUser,
  getUser,
  getUsers,
  updateUser,
  updateAvatar,
  getCurrentUserInfo,
} = require('../controllers/users');

routesUsers.post('/', createUser);
routesUsers.get('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), getCurrentUserInfo);
routesUsers.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex().required(),
  }),
}), getUser);
routesUsers.get('/', getUsers);
routesUsers.patch('/me', updateUser);
routesUsers.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi
      .string()
      .pattern(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/),
  }),
}), updateAvatar);

module.exports = routesUsers;
