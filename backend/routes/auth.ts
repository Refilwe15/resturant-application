import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User.ts";

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a user
 */
router.post("/register", async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.create(req.body);

    if (!process.env.JWT_SECRET) {
      res.status(500).json({ message: "JWT secret not configured" });
      return;
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({ 
      message: "User registered",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      }
    });
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
