const express = require('express');

const main = express();

const users = require('./users.js');
const movies = require('./movie.js');
const auth = require('../middlewares/auth');
const sign = require('./sign');

main.use(sign);
main.use('/users', auth, users);
main.use('/movies', auth, movies);

module.exports = main;
