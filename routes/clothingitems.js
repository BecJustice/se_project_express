const router = require("express").Router();

const {
  createItem,
  getItems,
  likeItem,
  deleteItem,
  dislikeItem,
} = require("../controllers/clothingItems");

//CRUD

//CREATE test
router.post("/", createItem);

//READ test
router.get("/", getItems);

//UPDATE/Like
router.put("/:itemId/likes", likeItem);

//DISLIKE
router.delete(":itemId/likes", dislikeItem);

//DELETE
router.delete("/:itemId", deleteItem);

module.exports = router;
