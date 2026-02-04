import { Router, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { User } from "./models.user";
import { authMiddleware, AuthRequest } from "./middleware.auth";

const router = Router();

router.get("/me", authMiddleware, async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  try {
    const user = await User.findById(authReq.userId).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    return res.json({ success: true, data: user });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Server error, please try again" });
  }
});

router.put(
  "/me",
  authMiddleware,
  [body("name").notEmpty().withMessage("Name is required")],
  async (req: Request, res: Response) => {
    const authReq = req as AuthRequest;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const updated = await User.findByIdAndUpdate(
        authReq.userId,
        { name: req.body.name },
        { new: true }
      ).select("-password");

      if (!updated) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      return res.json({ success: true, data: updated });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ success: false, message: "Server error, please try again" });
    }
  }
);

export default router;
