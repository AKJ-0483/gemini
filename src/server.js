require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { AppDataSource } = require("./data-source");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test Route
app.get("/health", (req, res) => {
  res.json({ message: "Gemini Backend Clone server is healthy" });
});

AppDataSource.initialize()
  .then(() => {
    console.log("✅ Connected to PostgreSQL with TypeORM");

    app.get("/health", (req, res) => {
      res.json({ message: "Gemini Backend Clone server is healthy" });
    });

    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server running at http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Error initializing database:", err);
  });
