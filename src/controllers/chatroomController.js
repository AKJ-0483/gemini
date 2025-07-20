const chatroomService = require("../services/chatroomService");
const messageQueue = require("../queue/messageQueue");

exports.createChatroom = async (req, res) => {
  try {
    const { title } = req.body;
    const chatroom = await chatroomService.createChatroom(req.user.id, title);
    res.status(201).json(chatroom);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.listChatrooms = async (req, res) => {
  try {
    const chatrooms = await chatroomService.getChatrooms(req.user.id);
    res.status(200).json(chatrooms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getChatroom = async (req, res) => {
  try {
    const chatroom = await chatroomService.getChatroomById(
      req.user.id,
      req.params.id
    );
    res.status(200).json(chatroom);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { content } = req.body;
    const { id: chatroomId } = req.params;
    const userId = req.user.id;

    // Save user message
    await chatroomService.saveMessage(chatroomId, "user", content);

    // Push job to queue
    await messageQueue.add("gemini-job", {
      userId,
      chatroomId,
      content,
    });

    res.status(202).json({ message: "Message queued for AI response" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
