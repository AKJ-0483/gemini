const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Message",
  tableName: "messages",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid",
    },
    role: {
      type: "varchar", // 'user' | 'gemini'
    },
    content: {
      type: "text",
    },
    createdAt: {
      type: "timestamp",
      createDate: true,
    },
  },
  relations: {
    chatroom: {
      type: "many-to-one",
      target: "Chatroom",
      joinColumn: true,
    },
  },
});
