const express = require('express');
const { celebrate, Joi } = require('celebrate');

const sign = express();

const {
  newUser,
  login,
} = require('../controlles/users');

const userValidate = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().required().min(3),
  }),
};

const userInValidate = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
};

sign.post('/signin', celebrate(userInValidate), login);
sign.post('/signup', celebrate(userValidate), newUser);

module.exports = sign;
