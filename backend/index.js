const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "*" },
});

app.use(cors());

let messages = [];

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Send chat history
  socket.emit("chat-history", messages);

  socket.on("send-message", (msg) => {
    const messageData = { id: socket.id, ...msg, type: "text" };
    messages.push(messageData);
    io.emit("receive-message", messageData);
  });

  socket.on("send-plugin-message", (msg) => {
    const pluginMessage = { id: socket.id, ...msg, type: "plugin" };
    messages.push(pluginMessage);
    io.emit("receive-message", pluginMessage);
  });
});

app.get("/", (req, res) => {
  res.send("Chat Server is running");
});

server.listen(5000, () => console.log("Server running on port 5000"));
