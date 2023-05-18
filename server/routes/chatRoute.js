const {
  createChat,
  getChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  remove,
} = require("../controller/chatController");
const { chats } = require("../data/data");
const { verifyToken } = require("../middleware/auth");

const router = require("express").Router();

router.post("/", verifyToken, createChat);
router.get("/", verifyToken, getChats);
router.post("/group", verifyToken, createGroupChat);
router.put("/group", verifyToken, renameGroup);
router.put("/group/add", verifyToken, addToGroup);
router.delete("/group/remove", verifyToken, remove);

module.exports = router;
