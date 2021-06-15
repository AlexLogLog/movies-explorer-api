const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserSchema = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const ConflictError = require('../errors/ConflictError');

const { JWT_SECRET = 'secret-key' } = process.env;

module.exports.getUsers = (req, res, next) => {
  UserSchema.find({})
    .then((users) => res.status(200).send(users))
    .catch(next);
};

module.exports.getUserMe = (req, res, next) => {
  UserSchema.findById(req.user._id)
    .orFail(new NotFoundError())
    .then((user) => {
      res.status(200).send(user);
    })
    .catch(next);
};

module.exports.newUser = async (req, res, next) => {
  const {
    email,
    password,
    name,
  } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);
    const userNew = await UserSchema.create({
      email,
      password: hash,
      name,
    });
    return res.status(200).send({
      name: userNew.name, email: userNew.email,
    });
  } catch (err) {
    if (err.name === 'MongoError' && err.code === 11000) {
      return next(new ConflictError('Пользователь с данным email уже есть'));
    }
    return next(err);
  }
};

module.exports.patchUser = (req, res, next) => {
  const { email, name } = req.body;
  UserSchema.findByIdAndUpdate(
    req.user._id,
    { email, name },
    { new: true, runValidators: true },
  )
    .orFail(new NotFoundError())
    .then((user) => {
      res.status(200).send(user);
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password, name } = req.body;
  UserSchema.findUserByCredentials(email, password, name)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        JWT_SECRET,
        { expiresIn: '7d' },
      );
      res.status(200).send({ token });
    })
    .catch(() => next(new UnauthorizedError('Неверный email или пароль')));
};
