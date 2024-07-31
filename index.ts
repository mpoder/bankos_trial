import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
import http from "node:http";
import jwt from "jsonwebtoken";
import { Server } from "socket.io";

import addUserRoutes from "./src/routes/userRoutes";
import addMessageRoutes from "./src/routes/messageRoutes";
import addStaticRoutes from "./src/routes/staticRoutes";
import User from "./src/models/User";
import type { ISocketResponse } from "./src/models/ISocketMessage";
import Message from "./src/models/Message";

dotenv.config();

const MONGODB_INSTANCE = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_URL}/${process.env.MONGODB_DB_NAME}?retryWrites=true&w=majority&appName=${process.env.MONGODB_APP_NAME}`;

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const JWT_SECRET = process.env.JWT_SECRET;
console.log(JWT_SECRET);

const serverPort = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

addUserRoutes(app);
addMessageRoutes(app);
addStaticRoutes(app);

io.on("connection", (socket) => {
  console.log("A user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
  socket.on("login", (tokenEvent) => {
    try {
      const token = tokenEvent.token;
      jwt.verify(token, JWT_SECRET as string);
      const decodedToken = jwt.decode(token) as { userId: string };
      const userId = decodedToken.userId;

      socket.emit("login success", userId);
    } catch (error) {
      console.log(error);
      socket.emit("auth error", "Invalid token");
    }
  });
  socket.on("chat message", async (messageContents) => {
    console.log(messageContents);
    const { message, token } = messageContents;
    try {
      jwt.verify(token, JWT_SECRET as string);
      const decodedToken = jwt.decode(token) as { userId: string };
      const userId = decodedToken.userId;

      const foundUser = await User.findOne({ _id: userId });
      if (foundUser) {
        const senderInitial = foundUser.userName[0].toUpperCase();

        const messageToSend: ISocketResponse = {
          message,
          senderId: userId,
          senderInitial
        };
        const databaseMessage = new Message({
          sender: foundUser,
          content: message
        });

        console.log(messageToSend);
        io.emit("chat message", messageToSend);
      }
    } catch (error) {
      console.log(error);
      socket.emit("auth error", "Invalid token");
    }
  });
});

const main = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_INSTANCE);
    console.log("Connected to MongoDB");

    server.listen(serverPort, () => {
      console.log(`[SERVER] Server is listening on port ${serverPort}`);
      console.log(`To connect, use: http://localhost:${serverPort}`);
    });
  } catch (error) {
    console.error(error);
  }
};

main();
