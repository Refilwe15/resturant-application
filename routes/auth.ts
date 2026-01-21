import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a user
 */
router.post("/register", async (req: Request, res: Response): Promise<void> => {
  try {
    await User.create(req.body);
    res.status(201).json({ message: "User registered" });
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(400).json({ error: "Registration failed" });
    }
  }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 */
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body as {
    email: string;
    password: string;
  };

  const user = await User.findOne({ where: { email } });

  if (!user || !(await user.validatePassword(password))) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }

  if (!process.env.JWT_SECRET) {
    res.status(500).json({ message: "JWT secret not configured" });
    return;
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.json({ token, user });
});

export default router;