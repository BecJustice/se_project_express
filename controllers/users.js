const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {
  BAD_REQUEST_STATUS_CODE,
  REQUEST_NOT_FOUND,
  CONFLICT_STATUS_CODE,
  DEFAULT_ERROR,
  UNAUTHORIZED_STATUS_CODE,
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

//login

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res(BAD_REQUEST_STATUS_CODE).send({
      message: "Email and password are required",
    });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      if (
        err.message.includes("Incorrect email") ||
        err.message.includes("Incorrect password")
      ) {
        return res(UNAUTHORIZED_STATUS_CODE).send({
          message: "incorrect email or password ",
        });
      }
      return res(DEFAULT_ERROR).send({
        message: "An error has occured on the server",
      });
    });
};

// GET /users

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.error(err);
      return res
        .status(DEFAULT_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

const createUser = (req, res) => {
  const { email, password, name, avatar } = req.body;

  if (!email || !password) {
    return res
      .status(BAD_REQUEST_STATUS_CODE)
      .send({ message: "Email and password are required." });
  }
  return User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        return res
          .status(CONFLICT_STATUS_CODE)
          .send({ message: "This email already exists" });
      }
      return bcrypt
        .hash(password, 10)
        .then((hash) =>
          User.create({
            email,
            password: hash,
            name,
            avatar,
          })
        )
        .then((user) => {
          res
            .status(201)
            .send({ email: user.email, name: user.name, avatar: user.avatar });
        });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: "Invalid data" });
      }
      return res
        .status(DEFAULT_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

/*User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: err.message });
      }
      return res
        .status(DEFAULT_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
}; */

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(REQUEST_NOT_FOUND).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: err.message });
      }
      return res
        .status(DEFAULT_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

module.exports = { getUsers, createUser, getUser, login };
