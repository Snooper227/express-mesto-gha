const jwt = require('jsonwebtoken');
const UnauthorizationError = require('../errors/UnauthorizationError');

module.exports = (req, _, next) => {
  const { authorization } = req.headers;
  const bearer = 'Bearer ';
  if (!authorization || !authorization.startsWith(bearer)) {
    return next(new UnauthorizationError({ messag: 'Неправильные почта или пароль' }));
  }
  const token = authorization.replace(bearer, '');
  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return new UnauthorizationError({ message: 'Неправильные почта или пароль' });
  }
  req.user = payload;

  return next();
};
