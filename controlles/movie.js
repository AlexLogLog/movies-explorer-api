const MovieSchema = require('../models/movie');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');

module.exports.getMovies = (req, res, next) => {
  MovieSchema.find({})
    .then((movies) => res.status(200).send(movies))
    .catch(next);
};

module.exports.newMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  const { _id: userId } = req.user;
  MovieSchema.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    owner: userId,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => res.status(200).send(movie))
    .catch(() => next(new BadRequestError()));
};

module.exports.deleteMovie = (req, res, next) => {
  const { movieIdDel } = req.params;
  MovieSchema.findOneAndRemove({ movieId: movieIdDel })
    .orFail(new NotFoundError('Фильм не найден'))
    .then((movie) => {
      if (movie.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Нельзя удалять чужие Фильмы');
      }
      res.status(200).send(movie);
    })
    .catch(next);
};
