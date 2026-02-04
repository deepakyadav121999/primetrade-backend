import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import { User } from "./models.user";
import { config } from "./config";

const router = Router();

const signToken = (userId: string) =>
  jwt.sign(
    { userId },
    config.jwtSecret as jwt.Secret,
    { expiresIn: config.jwtExpiresIn } as jwt.SignOptions
  );

router.post(
  "/signup",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, password } = req.body as {
      name: string;
      email: string;
      password: string;
    };

    try {
      const existing = await User.findOne({ email });
      if (existing) {
        return res
          .status(400)
          .json({ success: false, message: "Email already registered" });
      }

      const hashed = await bcrypt.hash(password, 10);
      const user = await User.create({ name, email, password: hashed });

      const token = signToken(user.id);
      return res.status(201).json({
        success: true,
        data: {
          token,
          user: { id: user.id, name: user.name, email: user.email },
        },
      });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ success: false, message: "Server error, please try again" });
    }
  }
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body as { email: string; password: string };

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid credentials" });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid credentials" });
      }

      const token = signToken(user.id);
      return res.json({
        success: true,
        data: {
          token,
          user: { id: user.id, name: user.name, email: user.email },
        },
      });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ success: false, message: "Server error, please try again" });
    }
  }
);

export default router;
