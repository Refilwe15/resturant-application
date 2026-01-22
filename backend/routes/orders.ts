import express, { Request, Response, Router } from "express";
import { Order } from "../models/Order";
import { CartItem } from "../models/CartItem";
import { FoodItem } from "../models/FoodItem";
import { authMiddleware } from "../middlewares/auth";

const router: Router = express.Router();

const calculateTotal = (
  cart: (CartItem & { FoodItem?: FoodItem })[],
): number => {
  return cart.reduce((sum, item) => {
    const price = item.FoodItem?.price || 0;
    return sum + item.quantity * price;
  }, 0);
};

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Place an order
 */
router.post("/", authMiddleware, async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  // Each CartItem may include its associated FoodItem
  const cart = (await CartItem.findAll({
    where: { userId: req.user.id },
    include: [FoodItem],
  })) as (CartItem & { FoodItem?: FoodItem })[];

  if (!cart.length) return res.status(400).json({ message: "Cart empty" });

  const total = calculateTotal(cart);

  const order = await Order.create({
    userId: req.user.id,
    items: cart.map((item) => ({
      // Use FoodItem.id instead of item.foodId
      foodId: item.FoodItem?.id,
      quantity: item.quantity,
      selectedExtras: item.selectedExtras,
    })),
    totalPrice: total,
    deliveryAddress: req.body.deliveryAddress,
    paymentStatus: "paid",
  });

  // Clear the cart
  await CartItem.destroy({ where: { userId: req.user.id } });

  res.status(201).json(order);
});

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: View user orders
 */
router.get("/", authMiddleware, async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  const orders = await Order.findAll({ where: { userId: req.user.id } });
  res.json(orders);
});

export default router;