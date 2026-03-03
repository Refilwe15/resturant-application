import { Router, Request, Response } from "express";
import { User } from "../models/User";
import { authMiddleware } from "../middlewares/auth";

interface AuthRequest extends Request {
  user: User; // full Sequelize User instance
}

const router = Router();

router.get("/profile", authMiddleware, async (req: Request, res: Response) => {
  const authReq = req as AuthRequest; // cast inside
  if (!authReq.user) return res.status(401).json({ message: "Unauthorized" });

  res.json(authReq.user);
});

router.put("/profile", authMiddleware, async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  if (!authReq.user) return res.status(401).json({ message: "Unauthorized" });

  await authReq.user.update(req.body);
  res.json({ message: "Profile updated", user: authReq.user });
});

export default router;
