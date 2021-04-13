const users = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUserMe,
  patchUser,

} = require('../controlles/users');

users.get('/me', getUserMe);

users.patch('/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(40),
      email: Joi.string().required().min(2).max(40),
    }),
  }),
  patchUser);

module.exports = users;
