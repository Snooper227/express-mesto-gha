const jwt = require('jsonwebtoken');
const { UnauthorizathionError } = require('../errors/UnauthorizationError');

const { NODE_ENV, JWT_SECRET } = process.env;

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.cookies;

  if (!authorization) {
    throw new UnauthorizathionError('Authorization is needed');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key',
    );
  } catch (err) {
    throw new UnauthorizathionError('Authorization is needed');
  }

  req.user = payload;
  next();
};
