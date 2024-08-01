import type express from "express";

import { authenticateToken } from "../middleware/auth";
import Message from "../models/Message";

const addMessageRoutes = (app: express.Application) => {
  app.get("/messages", authenticateToken, async (request, response) => {
    try {
      const messages = await Message.find().populate("sender").sort({ timestamp: 1 });
      response.status(200).json(messages);
    } catch (error) {
      console.log(error);
      response.status(500).send(error);
    }
  });

  app.post("/messages", authenticateToken, async (request, response) => {
    const { content } = request.body;

    if (!content) {
      return response.status(400).send("Missing required fields. Check values of 'content'");
    }

    try {
      const message = new Message({
        sender: (request as any).user._id,
        content,
        timestamp: Date.now()
      });
      await message.save();
      response.status(201).json({ message: "Message created" });
    } catch (error) {
      console.log(error);
      response.status(500).send(error);
    }
  });
};

export default addMessageRoutes;
