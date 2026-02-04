import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "./config";

export interface AuthRequest extends Request {
  userId: string;
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(
      token as string,
      config.jwtSecret as jwt.Secret
    ) as unknown as { userId: string };
    (req as AuthRequest).userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};
