const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Chatroom",
  tableName: "chatrooms",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid",
    },
    title: {
      type: "varchar",
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
      type: "many-to-one",
      target: "User",
      joinColumn: true,
      eager: true,
    },
    messages: {
      type: "one-to-many",
      target: "Message",
      inverseSide: "chatroom",
    },
  },
});
