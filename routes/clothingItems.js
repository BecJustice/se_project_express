const router = require("express").Router();

const {
  createItem,
  getItems,
  likeItem,
  deleteItem,
  dislikeItem,
} = require("../controllers/clothingItems");
const authorize = require("../middlewares/auth");

router.post("/", authorize, createItem);

router.get("/", getItems);

router.put("/:itemId/likes", authorize, likeItem);

router.delete("/:itemId/likes", authorize, dislikeItem);

router.delete("/:itemId", authorize, deleteItem);

module.exports = router;
