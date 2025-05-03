const socket = require("socket.io");
const {Chat} = require("../models/chat");

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: true,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {


    // Join chat room
    socket.on("joinChat", ({ firstName, roomId }) => {
      socket.join(roomId);
      // console.log(`${firstName} joined room: ${roomId}`);
    });

    // Handle sending a message
    socket.on("sendMessage", async ({ firstName, userId, targetUserId, text }) => {
      try {
        const roomId = [userId, targetUserId].sort().join("_");

        // Find or create chat
        let chat = await Chat.findOne({ participants: { $all: [userId, targetUserId] } });

        if (!chat) {
          chat = new Chat({
            participants: [userId, targetUserId],
            messages: [],
          });
        }

        // Add new message
        chat.messages.push({
          senderId: userId,
          text,
        });

        // Save chat
        await chat.save();

        // Emit to all in the room (including sender)
        io.to(roomId).emit("messageReceived", {
          firstName,
          text,
          userId, // Sender ID
        });

      } catch (err) {
        console.error("❌ Error in sendMessage:", err.message);
      }
    });

    // Handle user disconnect
    socket.on("disconnect", () => {
      // console.log("⚠️ User disconnected:", socket.id);
    });
  });
};

module.exports = initializeSocket;
