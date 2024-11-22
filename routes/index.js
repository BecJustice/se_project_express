const router = require("express").Router();
const { BAD_REQUEST_STATUS_CODE } = require("../utils/errors");

const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");

router.use("/users", userRouter);
router.use("/items", clothingItemRouter);

router.use((req, res) => {
  res.statusCode(BAD_REQUEST_STATUS_CODE).send({ message: "Router not found" });
});

module.exports = router;
