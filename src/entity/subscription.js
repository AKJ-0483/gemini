const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Subscription",
  tableName: "subscriptions",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid",
    },
    stripeCustomerId: {
      type: "varchar",
      unique: true,
    },
    stripeSessionId: {
      type: "varchar",
    },
    isActive: {
      type: "boolean",
      default: false,
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
  relations: {
    user: {
      type: "one-to-one",
      target: "User",
      joinColumn: true,
      eager: true,
    },
  },
});
