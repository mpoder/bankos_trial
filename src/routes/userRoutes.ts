import type express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/User";
import { authenticateToken } from "../middleware/auth";
import type { OnlineStatus } from "../models/OnlineStatus";

const addUserRoutes = (app: express.Application, userPresence: Map<string, OnlineStatus>): void => {
  const JWT_SECRET = process.env.JWT_SECRET || "secret";
  app.get("/users", async (request, response) => {
    try {
      const users = await User.find();
      response.status(200).json(users);
    } catch (error) {
      console.log(error);
      response.status(500).send(error);
    }
  });

  app.post("/users", async (request, response) => {
    const { userName, password } = request.body;

    if (!userName || !password) {
      return response.status(400).send("Missing required fields. Check values of 'userName' and 'password");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userExists = await User.findOne({ userName });

    if (userExists) {
      return response.status(400).send("User already exists");
    }

    try {
      const user = new User({
        userName,
        hashedPassword
      });

      await user.save();
      response.status(201).json({ message: "User created", user });
    } catch (error) {
      console.log(error);
      response.status(500).send(error);
    }
  });

  app.get("/presence", authenticateToken, async (request, response) => {
    const userPresenceArray = Array.from(userPresence, ([userId, status]) => ({ userId, status }));

    const userNames = await User.find({ _id: { $in: Array.from(userPresence.keys()) } }).select("userName");

    const userPresenceArrayWithNames = userPresenceArray.map(({ userId, status }) => {
      const userName = userNames.find((user) => (user._id as string).toString() === userId.toString())?.userName;
      return { userId, status, userName };
    });

    response.status(200).json(userPresenceArrayWithNames);
  });

  app.post("/login", async (request, response) => {
    try {
      const { userName, password } = request.body;

      const user = await User.findOne({ userName });

      if (!user || !(await bcrypt.compare(password, user.hashedPassword))) {
        return response.status(401).send({ error: "Invalid credentials" });
      }

      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });
      console.log(`User ${user.userName} logged in`);
      response.json({ token });
    } catch (error) {
      response.status(500).json({ error: "Internal server error", specificError: error });
    }
  });
};

export default addUserRoutes;
