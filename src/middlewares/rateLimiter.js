const redisClient = require("../utils/redisClient");
const subscriptionService = require("../services/subscriptionService");
require("dotenv").config();

const MAX_MESSAGES_BASIC = process.env.MAX_MESSAGE_BASIC;

exports.limitMessages = async (req, res, next) => {
  const userId = req.user.id;

  const tier = await subscriptionService.getSubscriptionStatus(userId);
  if (tier === "Pro") return next(); // unlimited for Pro

  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const key = `rate:${userId}:${today}`;

  const count = await redisClient.get(key);

  if (count && parseInt(count) >= MAX_MESSAGES_BASIC) {
    return res
      .status(429)
      .json({ error: "Daily limit reached for Basic plan" });
  }

  await redisClient.incr(key);
  await redisClient.expire(key, 86400); // 24 hrs
  next();
};
