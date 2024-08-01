import { configDotenv } from "dotenv";
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

configDotenv();

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    (req as any).user = user;
    next();
  });
};
