const User = require("../models/user");

// GET /users

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.error(err);
      return res.status(DEFAULT_ERROR).send({ message: err.message }); //take a look at this again
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => res.status(201).send(user)) //look here too
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: err.message });
      }
      return res.status(DEFAULT_ERROR).send({ message: err.message }); //look
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId).then((user) => res.status(200).send(user)); //look
};

module.exports = { getUsers, createUser, getUser };
