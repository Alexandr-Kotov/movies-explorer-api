const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BAD_REQUEST_ERROR = require('../errors/bad-req-error');
const NOT_FOUND_ERROR = require('../errors/notfound-error');
const CONFLICT_ERROR = require('../errors/conflict-error');
const UNAUTHORIZED_ERRROR = require('../errors/unauthorized-error');

const { NODE_ENV } = process.env;

module.exports.getUserById = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NOT_FOUND_ERROR('Пользователь не найден');
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BAD_REQUEST_ERROR('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      console.log(hash);
      return User.create({
        name,
        email,
        password: hash,
      });
    })
    .then((user) => res.status(201)
      .send({
        _id: user._id,
        name: user.name,
        email: user.email,
      }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new NOT_FOUND_ERROR('Пользователь не найден'));
      }
      if (err.code === 11000) {
        next(new CONFLICT_ERROR('Email уже зарегистрирован'));
      }
      next(err);
    });
};

module.exports.updateProfile = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NOT_FOUND_ERROR('Пользователь не найден');
      } else {
        res.send({
          data: {
            name: user.name,
            email: user.email,
          },
        });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BAD_REQUEST_ERROR('Переданы некорректные данные'));
      } else if (err.code === 11000) {
        next(new CONFLICT_ERROR('Пользователем с данным email уже зарегистрирован'));
      } else next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(() => next(new UNAUTHORIZED_ERRROR('Необходима авторизация')));
};