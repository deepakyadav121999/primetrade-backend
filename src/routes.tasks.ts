import { Router, Request, Response } from "express";
import { body, validationResult, param } from "express-validator";
import { Task } from "./models.task";
import { authMiddleware, AuthRequest } from "./middleware.auth";

const router = Router();

router.get(
  "/tasks",
  authMiddleware,
  async (req: Request, res: Response) => {
    const authReq = req as AuthRequest;
    const { q, status } = req.query as { q?: string; status?: string };
    const filter: any = { user: authReq.userId };
    if (status) filter.status = status;
    if (q) filter.title = { $regex: q, $options: "i" };

    try {
      const tasks = await Task.find(filter).sort({ createdAt: -1 });
      return res.json({ success: true, data: tasks });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ success: false, message: "Server error, please try again" });
    }
  }
);

router.post(
  "/tasks",
  authMiddleware,
  [body("title").notEmpty().withMessage("Title is required")],
  async (req: Request, res: Response) => {
    const authReq = req as AuthRequest;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    const { title, description, status } = req.body as {
      title: string;
      description?: string;
      status?: "pending" | "in-progress" | "done";
    };
    try {
      const task = await Task.create({
        user: authReq.userId as any,
        title,
        description,
        status,
      } as any);
      return res.status(201).json({ success: true, data: task });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ success: false, message: "Server error, please try again" });
    }
  }
);

router.get(
  "/tasks/:id",
  authMiddleware,
  [param("id").isMongoId().withMessage("Invalid task id")],
  async (req: Request, res: Response) => {
    const authReq = req as AuthRequest;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    try {
      const task = await Task.findOne({
        _id: req.params.id as any,
        user: authReq.userId as any,
      } as any);
      if (!task) {
        return res.status(404).json({ success: false, message: "Task not found" });
      }
      return res.json({ success: true, data: task });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ success: false, message: "Server error, please try again" });
    }
  }
);

router.put(
  "/tasks/:id",
  authMiddleware,
  [
    param("id").isMongoId().withMessage("Invalid task id"),
    body("title").notEmpty().withMessage("Title is required"),
  ],
  async (req: Request, res: Response) => {
    const authReq = req as AuthRequest;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    const { title, description, status } = req.body as {
      title: string;
      description?: string;
      status?: "pending" | "in-progress" | "done";
    };
    try {
      const task = await Task.findOneAndUpdate(
        { _id: req.params.id as any, user: authReq.userId as any } as any,
        { title, description, status },
        { new: true }
      );
      if (!task) {
        return res.status(404).json({ success: false, message: "Task not found" });
      }
      return res.json({ success: true, data: task });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ success: false, message: "Server error, please try again" });
    }
  }
);

router.delete(
  "/tasks/:id",
  authMiddleware,
  [param("id").isMongoId().withMessage("Invalid task id")],
  async (req: Request, res: Response) => {
    const authReq = req as AuthRequest;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    try {
      const deleted = await Task.findOneAndDelete({
        _id: req.params.id as any,
        user: authReq.userId as any,
      } as any);
      if (!deleted) {
        return res.status(404).json({ success: false, message: "Task not found" });
      }
      return res.json({ success: true, message: "Task deleted" });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ success: false, message: "Server error, please try again" });
    }
  }
);

export default router;
