// Servers
import { Server } from "socket.io";
import { createServer, METHODS } from "node:http";
import saveMessage from './lib/utils/saveMessage.js'
// Apps
import express from "express";
import { Socket } from "socket.io";
// Settings
import cors from "cors";
import logger from "morgan";

const app = express();
const port = process.env.PORT || 3001;

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Origen permitido (Next.js se ejecuta en 3000)
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  },
});

app.use(logger("dev"));
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

io.on("connection", (socket) => {
  socket.on("chat message", (msg) => {
    saveMessage(msg)
    socket.emit("chat message", msg);
  });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
