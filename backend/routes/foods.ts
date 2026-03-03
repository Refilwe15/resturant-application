import express, { Request, Response, Router } from "express";
import { FoodItem } from "../models/FoodItem.ts";
import { authMiddleware } from "../middlewares/auth.ts";
import multer from "multer";
import path from "path";

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


// Set storage location
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // make sure you create this folder
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Updated POST route
router.post("/", upload.single("image"), async (req: Request, res: Response) => {
  try {
    const { name, description, price, type, extras } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : undefined;

    const food = await FoodItem.create({
      name,
      description,
      price,
      type,
      extras: extras ? JSON.parse(extras) : [],
      image,
    });

    res.status(201).json(food);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create food" });
  }
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
