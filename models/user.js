const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const UNAUTHORIZED_ERRROR = require('../errors/unauthorized-error');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: () => 'Некорректный адрес почты',
    },
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UNAUTHORIZED_ERRROR('Неверно введён пароль или почта'));
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new UNAUTHORIZED_ERRROR('Неверно введён пароль или почта'));
        }
        return user;
      });
    });
};

module.exports = mongoose.model('user', userSchema);
