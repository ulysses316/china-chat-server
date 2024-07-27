// Servers
import { Server } from "socket.io";
import { createServer, METHODS } from "node:http";
import saveMessage from "./lib/utils/saveMessage.js";
// Apps
import express from "express";
import { Socket } from "socket.io";
// Settings
import cors from "cors";
import logger from "morgan";
import { corsConfig } from "./lib/utils/config.js";

const app = express();
const port = process.env.PORT || 3000;

const server = createServer(app);
const io = new Server(server, corsConfig);

app.use(logger("dev"));
app.use(cors(corsConfig));

io.on("connection", (socket) => {
  socket.on("chat message", (msg) => {
    saveMessage(msg);
    io.emit(msg.roomId, msg);
  });
});

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
