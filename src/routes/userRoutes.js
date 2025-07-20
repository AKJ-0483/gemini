const router = require("express").Router();
const { getMe } = require("../controllers/userController");
const { authenticateToken } = require("../middlewares/authMiddleware");

router.get("/me", authenticateToken, getMe);

module.exports = router;
