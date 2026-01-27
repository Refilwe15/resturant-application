import express, { Request, Response, Router } from "express";
import { Order } from "../models/Order.ts";
import { authMiddleware } from "../middlewares/auth.ts";

const router: Router = express.Router();

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Place an order
 */
router.post("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    // ✅ Ensure user is authenticated
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const { items, totalPrice, deliveryAddress, paymentStatus } = req.body;

    // ✅ Validate incoming data
    if (!items || !Array.isArray(items) || items.length === 0)
      return res.status(400).json({ message: "Cart is empty" });

    if (!totalPrice || !deliveryAddress)
      return res
        .status(400)
        .json({ message: "Missing totalPrice or deliveryAddress" });

    // ✅ Create order
    const order = await Order.create({
      userId: req.user.id,
      items, // frontend sends items as [{ foodId, quantity, selectedExtras, notes }]
      totalPrice,
      deliveryAddress,
      paymentStatus: paymentStatus || "pending",
      orderStatus: "processing",
    });

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (err: any) {
    console.error("POST /orders error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
});

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: View user orders
 */
router.get("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    // ✅ Fetch user orders
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
    });

    return res.json({
      success: true,
      message: "Orders fetched successfully",
      orders,
    });
  } catch (err: any) {
    console.error("GET /orders error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
});

export default router;
