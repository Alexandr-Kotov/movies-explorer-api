const Movie = require('../models/movie');
const BAD_REQUEST_ERROR = require('../errors/bad-req-error');
const FORBIDDEN_ERROR = require('../errors/forbidden-error');
const NOT_FOUND_ERROR = require('../errors/notfound-error');

module.exports.getMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .then((movies) => {
      res.status(200).send({ movies });
    })
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  const owner = req.user._id;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner,
  })
    .then((movie) => res.status(200)
      .send({ movie }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BAD_REQUEST_ERROR('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params._id)
    .orFail(() => {
      throw new NOT_FOUND_ERROR('Карточка с фильмом по указанному id не найдена');
    })
    .then((movie) => {
      if (String(movie.owner) !== String(req.user._id)) {
        throw new FORBIDDEN_ERROR('Запрещено удалять чужую карточку');
      }
    })
    .then(() => {
      Movie.findByIdAndRemove(req.params._id)
        .then((movie) => {
          if (!movie) {
            throw new BAD_REQUEST_ERROR('Переданы некорректные данные');
          } return res.send({ movie });
        });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new NOT_FOUND_ERROR('Карточка с фильмом по указанному id не найдена'));
      } else {
        next(err);
      }
    });
};