const express = require('express');
const NotFoundError = require('../errors/NotFoundError');

const main = express();

const users = require('./users.js');
const movies = require('./movie.js');
const auth = require('../middlewares/auth');
const sign = require('./sign');

main.use(sign);
main.use('/users', auth, users);
main.use('/movies', auth, movies);
main.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

main.all('*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

module.exports = main;
