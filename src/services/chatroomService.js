const { AppDataSource } = require("../data-source");
const redisClient = require("../utils/redisClient");

const chatroomRepo = AppDataSource.getRepository("Chatroom");
const messageRepo = AppDataSource.getRepository("Message");

exports.createChatroom = async (userId, title) => {
  const chatroom = chatroomRepo.create({ title, user: { id: userId } });
  await chatroomRepo.save(chatroom);

  // Invalidate chatroom cache
  await redisClient.del(`chatrooms:${userId}`);
  return chatroom;
};

exports.getChatrooms = async (userId) => {
  const cacheKey = `chatrooms:${userId}`;
  const cached = await redisClient.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const chatrooms = await chatroomRepo
    .createQueryBuilder("chatroom")
    .leftJoinAndSelect("chatroom.user", "user")
    .where("user.id = :userId", { userId })
    .orderBy("chatroom.updatedAt", "DESC")
    .select(["chatroom", "user.id", "user.mobile", "user.name"])
    .getMany();

  await redisClient.setEx(cacheKey, 60, JSON.stringify(chatrooms)); // 10 min TTL
  return chatrooms;
};

exports.getChatroomById = async (userId, chatroomId) => {
  const chatroom = await chatroomRepo
    .createQueryBuilder("chatroom")
    .leftJoinAndSelect("chatroom.user", "user")
    .leftJoinAndSelect("chatroom.messages", "messages")
    .where("chatroom.id = :chatroomId", { chatroomId })
    .andWhere("user.id = :userId", { userId })
    .select([
      "chatroom",
      "user.id",
      "user.name",
      "user.mobile",
      "messages.id",
      "messages.role",
      "messages.content",
      "messages.createdAt",
    ])
    .getOne();
  if (!chatroom) throw new Error("Chatroom not found");
  return chatroom;
};

exports.saveMessage = async (chatroomId, role, content) => {
  const message = messageRepo.create({
    chatroom: { id: chatroomId },
    role,
    content,
  });
  await messageRepo.save(message);
  return message;
};
