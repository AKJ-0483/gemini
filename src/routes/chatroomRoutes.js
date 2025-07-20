const router = require("express").Router();
const chatroomController = require("../controllers/chatroomController");
const { authenticateToken } = require("../middlewares/authMiddleware");
const { limitMessages } = require("../middlewares/rateLimiter");

router.post("/", authenticateToken, chatroomController.createChatroom);
router.get("/", authenticateToken, chatroomController.listChatrooms);
router.get("/:id", authenticateToken, chatroomController.getChatroom);
router.post(
  "/:id/message",
  authenticateToken,
  limitMessages,
  chatroomController.sendMessage
);

module.exports = router;
