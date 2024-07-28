// Servers
import { Server } from "socket.io";
import { createServer, METHODS } from "node:http";
import saveMessage from "./lib/utils/saveMessage.js";
// Apps
import express from "express";
import { Socket } from "socket.io";
import { ExpressPeerServer } from "peer";
// Settings
import cors from "cors";
import logger from "morgan";
import { corsConfig } from "./lib/utils/config.js";

const app = express();
const port = process.env.PORT || 3000;

const server = createServer(app);
const io = new Server(server, corsConfig);
const peerServer = ExpressPeerServer(server, {
  debug: true,
});

app.use(logger("dev"));
app.use(cors(corsConfig));
app.use("/peerjs", peerServer);

io.on("connection", (socket) => {

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
  });

  socket.on("chat-message", (message) => {
    saveMessage(message);
    io.to(message.roomId).emit("receive-message", message);
  });

  socket.on("call-user", (roomId, meetingId) => {
    io.to(roomId).emit("receive-call", meetingId);
  });

});

app.get("/", function (req, res) {
  res.send("hello world");
});

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
