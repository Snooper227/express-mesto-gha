const jwt = require('jsonwebtoken');
const { UnauthorizathionError } = require('../errors/UnauthorizationError');

function auth(req, _, next) {
  const { authorization } = req.headers;
  const bearer = 'Bearer ';
  if (!authorization || !authorization.startsWith(bearer)) {
    return next(
      new UnauthorizathionError('Неправильные почта или пароль'),
    );
  }
  const token = authorization.replace(bearer, '');
  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return new UnauthorizathionError('Неправильные почта или пароль');
  }
  req.user = payload;

  return next();
}

module.exports = auth;
