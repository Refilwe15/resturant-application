import express, { Request, Response, Router } from "express";
import { Order } from "../models/Order.ts";
import { User } from "../models/User.ts";
import { authMiddleware } from "../middlewares/auth.ts";

const router: Router = express.Router();

/**
 * @swagger
 * /api/admin/orders:
 *   get:
 *     summary: Get ALL orders (Admin)
 */
router.get("/orders", authMiddleware, async (req: Request, res: Response) => {
  try {
    // 🔐 Optional role check (recommended)
    // if (req.user.role !== "admin") {
    //   return res.status(403).json({ message: "Admins only" });
    // }

    const orders = await Order.findAll({
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          attributes: ["id", "name", "email"],
        },
      ],
    });

    return res.json({
      success: true,
      orders,
    });
  } catch (err: any) {
    console.error("GET /api/admin/orders error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
});

/**
 * @swagger
 * /api/admin/orders/{id}/status:
 *   put:
 *     summary: Update order status (Admin)
 */
router.put(
  "/orders/:id/status",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { orderStatus } = req.body;

      if (!orderStatus) {
        return res.status(400).json({
          message: "orderStatus is required",
        });
      }

      const order = await Order.findByPk(id);
      if (!order) {
        return res.status(404).json({
          message: "Order not found",
        });
      }

      await order.update({ orderStatus });

      return res.json({
        success: true,
        message: "Order status updated successfully",
        order,
      });
    } catch (err: any) {
      console.error("PUT /api/admin/orders/:id/status error:", err);
      return res.status(500).json({
        message: "Failed to update order status",
      });
    }
  }
);

export default router;
