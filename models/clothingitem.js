const mongoose = require("mongoose");
const validator = require("validator");
const user = require("./user");

const clothingItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  weather: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL",
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: user, // link to item author's model of the ObjectId type
    required: true,
  },
  likes: {
    b: Boolean,
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    default: [],
    // a list of users who liked the item
    // an ObjectId array with a reference to the user modal
    // (empty by default)
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("clothingItems", clothingItemSchema);
