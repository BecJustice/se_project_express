const ClothingItem = require("../models/clothingItem");
const {
  BAD_REQUEST_STATUS_CODE,
  REQUEST_NOT_FOUND,
  DEFAULT_ERROR,
} = require("../utils/errors");

const createItem = (req, res) => {
  console.log(req);
  console.log(req.user._id);

  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: err.message });
      }
      return res.status(DEFAULT_ERROR).send({ message: err.message });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => {
      res.status(200).send(items);
    })
    .catch(() => {
      res.status(DEFAULT_ERROR).send({ message: "Error from getItems" });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  console.log(itemId);
  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => res.status(204).send(item))
    .catch(() => {
      res.status(DEFAULT_ERROR).send({ message: "Error from deleteItem" });
    });
};

const likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFound") {
        return res.status(REQUEST_NOT_FOUND).send({ message: err.message });
      }
      if (err.name === "ValidationError" || err.name === "CastError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: err.message });
      }
      return res.status(REQUEST_NOT_FOUND).send({ message: err.message });
    });
};

const dislikeItem = (req, res) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFound") {
        return res.status(REQUEST_NOT_FOUND).send({ message: err.message });
      }
      if (err.name === "ValidationError" || err.name === "CastError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: err.message });
      }
      return res.status(REQUEST_NOT_FOUND).send({ message: err.message });
    });

module.exports = { createItem, getItems, likeItem, deleteItem, dislikeItem };
