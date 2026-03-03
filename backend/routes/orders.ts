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

/**
 * @swagger
 * /api/orders/{id}/status:
 *   put:
 *     summary: Update order status (Admin)
 */
router.put("/:id/status", authMiddleware, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(403).json({ message: "Admins only" });
    }

    const { id } = req.params;
    const { orderStatus } = req.body;

    if (!orderStatus) {
      return res.status(400).json({ message: "orderStatus is required" });
    }

    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    await order.update({ orderStatus });

    return res.json({
      success: true,
      message: "Order status updated",
      order,
    });
  } catch (err: any) {
    console.error("PUT /orders/:id/status error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});
/**
 * @swagger
 * /api/orders/my-orders:
 *   get:
 *     summary: Get orders belonging to the logged-in user
 * 
 */
router.get("/my-orders", authMiddleware, async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    // Fetch orders for the current user only
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
    });

    return res.json({
      success: true,
      message: "User orders fetched successfully",
      orders,
    });
  } catch (err: any) {
    console.error("GET /orders/my-orders error:", err);
    return res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});



export default router;
