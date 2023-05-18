const router = require("express").Router();

const { signup, loginUser, getUsers } = require("../controller/userController");
const { verifyToken } = require("../middleware/auth");
router.post("/signup", signup);
router.post("/login", loginUser);
router.get("/users", verifyToken, getUsers);

module.exports = router;
