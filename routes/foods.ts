import express, { Request, Response, Router } from "express";
import { FoodItem } from "../models/FoodItem";
import { authMiddleware } from "../middlewares/auth";

const router: Router = express.Router();

const getParam = (param: string | string[] | undefined): string | undefined => {
  if (!param) return undefined;
  return Array.isArray(param) ? param[0] : param;
};

/**
 * @swagger
 * /api/foods:
 *   get:
 *     summary: Get all food items
 */
router.get("/", async (req: Request, res: Response) => {
  const foods = await FoodItem.findAll();
  res.json(foods);
});

/**
 * @swagger
 * /api/foods/{id}:
 *   get:
 *     summary: Get single food item
 */
router.get("/:id", async (req: Request, res: Response) => {
  const id = getParam(req.params.id);
  if (!id) return res.status(400).json({ message: "Missing id parameter" });

  const food = await FoodItem.findByPk(id);
  if (!food) return res.status(404).json({ message: "Food not found" });

  res.json(food);
});

/**
 * @swagger
 * /api/foods:
 *   post:
 *     summary: Create food (Admin)
 */
router.post("/", authMiddleware, async (req: Request, res: Response) => {
  const food = await FoodItem.create(req.body);
  res.status(201).json(food);
});

/**
 * @swagger
 * /api/foods/{id}:
 *   put:
 *     summary: Update food (Admin)
 */
router.put("/:id", authMiddleware, async (req: Request, res: Response) => {
  const id = getParam(req.params.id);
  if (!id) return res.status(400).json({ message: "Missing id parameter" });

  const food = await FoodItem.findByPk(id);
  if (!food) return res.status(404).json({ message: "Food not found" });

  await food.update(req.body);
  res.json(food);
});

/**
 * @swagger
 * /api/foods/{id}:
 *   delete:
 *     summary: Delete food (Admin)
 */
router.delete("/:id", authMiddleware, async (req: Request, res: Response) => {
  const id = getParam(req.params.id);
  if (!id) return res.status(400).json({ message: "Missing id parameter" });

  await FoodItem.destroy({ where: { id } });
  res.json({ message: "Food deleted" });
});

export default router;