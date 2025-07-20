const { Worker } = require("bullmq");
const Redis = require("ioredis");
const chatroomService = require("../services/chatroomService");
const { getGeminiResponse } = require("../utils/geminiClient");
const { AppDataSource } = require("../data-source");

const redis = new Redis({
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

// 🟢 Start the worker only after DB is initialized
AppDataSource.initialize()
  .then(() => {
    console.log("✅ TypeORM initialized in worker");

    const worker = new Worker(
      "messageQueue",
      async (job) => {
        const { chatroomId, content } = job.data;
        const aiReply = await getGeminiResponse(content);
        await chatroomService.saveMessage(chatroomId, "gemini", aiReply);
      },
      { connection: redis }
    );

    worker.on("completed", (job) => {
      console.log(`✅ Gemini response handled for job ${job.id}`);
    });

    worker.on("failed", (job, err) => {
      console.error(`❌ Job ${job.id} failed:`, err);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to initialize TypeORM in worker:", err);
  });
