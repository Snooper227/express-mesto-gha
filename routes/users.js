const routesUsers = require('express').Router();
const {
  createUser,
  getUser,
  getUsers,
  updateUser,
  updateAvatar,
  getCurrentUserInfo,
} = require('../controllers/users');

routesUsers.post('/', createUser);
routesUsers.get('/me', getCurrentUserInfo);
routesUsers.get('/:id', getUser);
routesUsers.get('/', getUsers);
routesUsers.patch('/me', updateUser);
routesUsers.patch('/me/avatar', updateAvatar);

module.exports = routesUsers;
