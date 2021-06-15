const movies = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { isURL } = require('validator');
const {
  getMovies,
  newMovie,
  deleteMovie,
} = require('../controlles/movie');

movies.get('/', getMovies);

movies.post('/',
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required().min(2).max(30),
      director: Joi.string().required().min(2).max(30),
      duration: Joi.number().required().min(1).max(1000),
      year: Joi.string().required().min(1).max(15),
      description: Joi.string().required().min(2).max(50),

      image: Joi.string().required().custom((value, helpers) => {
        if (!isURL(value)) return helpers.error('Невалидная ссылка');
        return value;
      }),
      trailer: Joi.string().required().custom((value, helpers) => {
        if (!isURL(value)) return helpers.error('Невалидная ссылка');
        return value;
      }),
      thumbnail: Joi.string().required().custom((value, helpers) => {
        if (!isURL(value)) return helpers.error('Невалидная ссылка');
        return value;
      }),
      movieId: Joi.number().required().min(1),
      nameRU: Joi.string().required().min(2).max(30),
      nameEN: Joi.string().required().min(2).max(30),
    }),
  }),
  newMovie);

movies.delete('/:movieId',
  celebrate({
    params: Joi.object().keys({
      movieId: Joi.string().hex().length(24),
    }),
  }),
  deleteMovie);

module.exports = movies;
