const jwt = require('jsonwebtoken');
const { UnauthorizathionError } = require('../errors/UnauthorizationError');

function auth(req, res, next) {
  try {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new UnauthorizathionError(
        'Для выполнения действия необходима авторизация',
      );
    }

    const token = authorization.replace('Bearer ', '');
    let payload;

    try {
      payload = jwt.verify(token, 'some-secret-key');
    } catch (err) {
      throw new UnauthorizathionError(
        'Для выполнения действия необходима авторизация',
      );
    }

    req.user = payload;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = { auth };
