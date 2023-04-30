const jwt = require('jsonwebtoken');
const { UnauthorizathionError } = require('../errors/UnauthorizationError');

module.exports = (req, _, next) => {
  const { authorization } = req.headers;
  const bearer = 'Bearer ';

  if (!authorization || !authorization.startsWith(bearer)) {
    return next(new UnauthorizathionError('Неправильные почта или пароль'));
  }

  const token = authorization.replace(bearer, '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key', { expiresIn: '7d' });
  } catch (err) {
    return next(new UnauthorizathionError('Неправильные почта или пароль'));
  }

  req.user = payload;

  return next();
};
