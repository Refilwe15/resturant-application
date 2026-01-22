import express, { Request, Response, Router } from "express";
import { CartItem } from "../models/CartItem.ts";
import { FoodItem } from "../models/FoodItem.ts";
import { authMiddleware } from "../middlewares/auth.ts";

const router: Router = express.Router();

const getParam = (param: string | string[] | undefined): string | undefined => {
  if (!param) return undefined;
  return Array.isArray(param) ? param[0] : param;
};

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: View cart
 */
router.get("/", authMiddleware, async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  const cart = await CartItem.findAll({
    where: { userId: req.user.id },
    include: [FoodItem],
  });

  res.json(cart);
});

/**
 * @swagger
 * /api/cart:
 *   post:
 *     summary: Add to cart
 */
router.post("/", authMiddleware, async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  const item = await CartItem.create({
    ...req.body,
    userId: req.user.id,
  });

  res.status(201).json(item);
});

/**
 * @swagger
 * /api/cart/{id}:
 *   put:
 *     summary: Update cart item
 */
router.put("/:id", authMiddleware, async (req: Request, res: Response) => {
  const id = getParam(req.params.id);
  if (!id) return res.status(400).json({ message: "Missing id parameter" });

  const item = await CartItem.findByPk(id);
  if (!item) return res.status(404).json({ message: "Item not found" });

  await item.update(req.body);
  res.json(item);
});

/**
 * @swagger
 * /api/cart/{id}:
 *   delete:
 *     summary: Remove cart item
 */
router.delete("/:id", authMiddleware, async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  const id = getParam(req.params.id);
  if (!id) return res.status(400).json({ message: "Missing id parameter" });

  await CartItem.destroy({
    where: { id, userId: req.user.id },
  });

  res.json({ message: "Item removed" });
});

/**
 * @swagger
 * /api/cart:
 *   delete:
 *     summary: Clear cart
 */
router.delete("/", authMiddleware, async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  await CartItem.destroy({
    where: { userId: req.user.id },
  });

  res.json({ message: "Cart cleared" });
});

export default router;
