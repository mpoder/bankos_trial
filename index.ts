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
import { OnlineStatus } from "./src/models/OnlineStatus";

dotenv.config();

const MONGODB_INSTANCE = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_URL}/${process.env.MONGODB_DB_NAME}?retryWrites=true&w=majority&appName=${process.env.MONGODB_APP_NAME}`;
const LOGGED_IN_ROOM = "loggedIn";

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

const serverPort = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const userPresence = new Map<string, OnlineStatus>();
addUserRoutes(app, userPresence);
addMessageRoutes(app);
addStaticRoutes(app);

/**
 * A map of socketIds to userIds
 */
const userToSocketMap = new Map<string, string>();

io.on("connection", (socket) => {
  socket.on("disconnect", () => {
    const id = socket.id;
    const user = userToSocketMap.get(id);

    if (user) {
      userPresence.set(user, OnlineStatus.Offline);
      userToSocketMap.delete(id);
      socket.leave(LOGGED_IN_ROOM);
      io.to(LOGGED_IN_ROOM).emit("presence", { userId: user, status: OnlineStatus.Offline });
    }
  });
  socket.on("check_token", (userToken) => {
    try {
      jwt.verify(userToken, JWT_SECRET as string);
      socket.emit("token_valid", true);
    } catch (error) {
      socket.emit("token_valid", false);
      const id = socket.id;
      const user = userToSocketMap.get(id);

      if (user) {
        userPresence.set(user, OnlineStatus.Offline);
        userToSocketMap.delete(id);
        socket.leave(LOGGED_IN_ROOM);
        io.to(LOGGED_IN_ROOM).emit("presence", { userId: user, status: OnlineStatus.Offline });
      }
    }
  });
  socket.on("login", async (tokenEvent) => {
    try {
      const token = tokenEvent.token;
      jwt.verify(token, JWT_SECRET as string);
      const decodedToken = jwt.decode(token) as { userId: string };
      const userId = decodedToken.userId;

      userPresence.set(userId, OnlineStatus.Online);
      userToSocketMap.set(socket.id, userId);
      const user = await User.findOne({ _id: userId }).select("userName");
      if (!user) return;

      socket.join(LOGGED_IN_ROOM);
      socket.emit("login success", userId);
      io.to(LOGGED_IN_ROOM).emit("presence", { userId, status: OnlineStatus.Online, userName: user.userName });
    } catch (error) {
      socket.emit("auth error", "Invalid token");
    }
  });
  socket.on("chat message", async (messageContents) => {
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
        databaseMessage.save();

        io.to(LOGGED_IN_ROOM).emit("chat message", messageToSend);
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
