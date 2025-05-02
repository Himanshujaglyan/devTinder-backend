const socket = require("socket.io");

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    // Join chat room
    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      const roomId = [userId, targetUserId].sort().join("_");
      socket.join(roomId);
    });

    // Send message to others in the room (not to sender)
    socket.on("sendMessage", ({ firstName, userId, targetUserId, text }) => {
      const roomId = [userId, targetUserId].sort().join("_");
      socket.to(roomId).emit("messageReceived", {
        firstName,
        text,
        userId, // Send sender's ID so receiver can identify
      });
    });

    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
