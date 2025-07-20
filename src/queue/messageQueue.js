const { Queue } = require("bullmq");
const Redis = require("ioredis");

const connection = new Redis();

const messageQueue = new Queue("messageQueue", { connection });

module.exports = messageQueue;
