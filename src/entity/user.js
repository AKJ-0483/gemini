// src/entity/User.js
const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "User",
  tableName: "users",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid",
    },
    mobile: {
      type: "varchar",
      unique: true,
    },
    name: {
      type: "varchar",
      nullable: true,
    },
    password: {
      type: "varchar",
      nullable: true,
    },
    otp: {
      type: "varchar",
      nullable: true,
    },
    otpExpiresAt: {
      type: "timestamp",
      nullable: true,
    },
    createdAt: {
      type: "timestamp",
      createDate: true,
    },
    updatedAt: {
      type: "timestamp",
      updateDate: true,
    },
  },
});
