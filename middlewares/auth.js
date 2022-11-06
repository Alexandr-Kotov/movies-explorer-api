const jwt = require('jsonwebtoken');
const UNAUTHORIZED_ERRROR = require('../errors/unauthorized-error');

const { JWT_SECRET, NODE_ENV } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UNAUTHORIZED_ERRROR('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');
  console.log(token);
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    throw new UNAUTHORIZED_ERRROR('Необходима авторизация');
  }

  req.user = payload;

  next();
};
