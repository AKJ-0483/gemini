require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { AppDataSource } = require("./src/data-source");

const app = express();

// Middleware
app.use(cors());

app.post(
  "/webhook/stripe",
  express.raw({ type: "application/json" }),
  require("./src/controllers/subscriptionController").handleWebhook
);

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date(),
  });
});

const authRoutes = require("./src/routes/authRoutes");
app.use("/auth", authRoutes);

const userRoutes = require("./src/routes/userRoutes");
app.use("/user", userRoutes);

const chatroomRoutes = require("./src/routes/chatroomRoutes");
app.use("/chatroom", chatroomRoutes);

const subscriptionRoutes = require("./src/routes/subscriptionRoutes");
app.use("/", subscriptionRoutes);

AppDataSource.initialize()
  .then(() => {
    console.log("✅ Connected to PostgreSQL with TypeORM");

    app.get("/health", (req, res) => {
      res.json({ message: "Gemini Backend Clone server is healthy" });
    });

    app.listen(process.env.PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running at http://0.0.0.0:${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Error initializing database:", err);
  });
