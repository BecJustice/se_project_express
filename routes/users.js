const router = require("express").Router();
const { getUsers, createUser, getUser } = require("../controllers/users");
const authorize = require("../middlewares/auth");

router.get("/me", authorize, getUser);
router.patch("/me", authorize, getUsers);

module.exports = router;
