const { DataSource } = require("typeorm");
require("reflect-metadata");
require("dotenv").config();

const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true, // ✅ for dev only — use migrations in prod
  logging: false,
  entities: [
    require("./entity/user"),
    require("./entity/chatroom"),
    require("./entity/message"),
    require("./entity/subscription"),
  ],
});

module.exports = { AppDataSource };
