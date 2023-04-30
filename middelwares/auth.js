const jwt = require('jsonwebtoken');
const { UnauthorizathionError } = require('../errors/UnauthorizationError');

const { NODE_ENV, SECRET_KEY } = process.env;

function auth(req, res, next) {
  const token = req.cookies.jwt;
  if (!token) {
    return next(new UnauthorizathionError('Необходима авторизация'));
  }
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? SECRET_KEY : 'some-secret-key');
  } catch (err) {
    return next(new UnauthorizathionError('Необходима авторизация'));
  }
  req.user = payload;
  return next();
}

module.exports = { auth };
