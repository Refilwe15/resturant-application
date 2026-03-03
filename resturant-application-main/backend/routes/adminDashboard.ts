import express, { Request, Response } from "express";
import { Order } from "../models/Order.ts";
import { FoodItem } from "../models/FoodItem.ts";
import { sequelize } from "../config/db.ts";
import { authMiddleware } from "../middlewares/auth.ts";
import { Op } from "sequelize";

const router = express.Router();

router.get("/dashboard", authMiddleware, async (req: Request, res: Response) => {
  try {
    // 🔐 you can later add role check here (admin)

    const openOrders = await Order.count({
      where: { orderStatus: { [Op.ne]: "delivered" } }
    });

    const completedOrders = await Order.count({
      where: { orderStatus: "delivered" }
    });

    const totalFoods = await FoodItem.count();

    const revenueResult = await Order.sum("totalPrice", {
      where: { orderStatus: "delivered" }
    });

    const recentOrders = await Order.findAll({
      order: [["createdAt", "DESC"]],
      limit: 5,
      attributes: ["id", "orderStatus", "totalPrice", "createdAt"],
      include: ["User"]
    });

    // Orders per day (last 7 days)
    const ordersByDay = await Order.findAll({
      attributes: [
        [sequelize.fn("DATE", sequelize.col("createdAt")), "date"],
        [sequelize.fn("COUNT", "*"), "count"]
      ],
      group: ["date"],
      order: [["date", "ASC"]],
      limit: 7
    });

    const revenueByDay = await Order.findAll({
      attributes: [
        [sequelize.fn("DATE", sequelize.col("createdAt")), "date"],
        [sequelize.fn("SUM", sequelize.col("totalPrice")), "total"]
      ],
      where: { orderStatus: "completed" },
      group: ["date"],
      order: [["date", "ASC"]],
      limit: 7
    });

    res.json({
      stats: {
        openOrders,
        completedOrders,
        totalFoods,
        totalRevenue: revenueResult || 0
      },
      recentOrders,
      ordersByDay,
      revenueByDay
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "Dashboard error" });
  }
});

export default router;
