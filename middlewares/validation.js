const { celebrate, Joi } = require('celebrate');
const { isURL, isEmail } = require('validator');

module.exports.getUserByIdValidation = celebrate({
  body: Joi.object().keys({
    userId: Joi.string().required().length(24).hex(),
  }),
});

module.exports.createUserValidation = celebrate({ /* /sigup */
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required().custom((value, error) => {
      if (isEmail(value)) {
        return value;
      }
      return error.message('Некорректный формат адреса');
    }),
    password: Joi.string().required(),
  }),
});

module.exports.updateProfileValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required().custom((value, error) => {
      if (isEmail(value)) {
        return value;
      }
      return error.message('Некорректный формат адреса');
    }),
  }),
});

module.exports.loginValidation = celebrate({ /* /sigin */
  body: Joi.object().keys({
    email: Joi.string().required().custom((value, error) => {
      if (isEmail(value)) {
        return value;
      }
      return error.message('Некорректный формат адреса');
    }),
    password: Joi.string().required(),
  }),
});

module.exports.userMovieIdValidation = celebrate({
  params: Joi.object().keys({
    _id: Joi.string().required().length(24).hex(),
  }),
});

module.exports.createMovieValidation = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom((value, error) => {
      if (isURL(value)) {
        return value;
      }
      return error.message('Некорректный формат ссылки');
    }),
    trailerLink: Joi.string().required().custom((value, error) => {
      if (isURL(value)) {
        return value;
      }
      return error.message('Некорректный формат ссылки');
    }),
    thumbnail: Joi.string().required().custom((value, error) => {
      if (isURL(value)) {
        return value;
      }
      return error.message('Некорректный формат ссылки');
    }),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});
