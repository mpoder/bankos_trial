import type express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/User";

const addUserRoutes = (app: express.Application) => {
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

    console.log(request.body);
    if (!userName || !password) {
      return response.status(400).send("Missing required fields. Check values of 'userName' and 'password");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

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

  app.post("/login", async (request, response) => {
    try {
      const { userName, password } = request.body;

      const user = await User.findOne({ userName });

      console.log({ userName, password });
      if (!user || !(await bcrypt.compare(password, user.hashedPassword))) {
        return response.status(401).send("Invalid credentials");
      }

      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });
      response.json({ token });
    } catch (error) {
      response.status(500).json({ error: "Internal server error", specificError: error });
    }
  });
};

export default addUserRoutes;
