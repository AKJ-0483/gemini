const router = require("express").Router();
const express = require("express");

const controller = require("../controllers/subscriptionController");
const { authenticateToken } = require("../middlewares/authMiddleware");

router.post("/subscribe/pro", authenticateToken, controller.subscribePro);
router.get("/subscription/status", authenticateToken, controller.getStatus);

module.exports = router;
