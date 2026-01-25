import "dotenv/config";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import path from "path";
import { sequelize } from "./config/db.ts"; // Your DB config
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.ts";

import authRoutes from "./routes/auth.ts";
import userRoutes from "./routes/users.ts";
import foodRoutes from "./routes/foods.ts";
import cartRoutes from "./routes/cart.ts";
import orderRoutes from "./routes/orders.ts";

import fs from "fs";
import { fileURLToPath } from "url";
import Stripe from "stripe";

// Recreate __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads folder if it doesn't exist
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// ===============================
// App
// ===============================
const app: Application = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(uploadDir));

// ===============================
// Swagger
// ===============================
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ===============================
// Routes
// ===============================
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

// ===============================
// Stripe Payment
// ===============================
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2022-11-15",
});

// Create PaymentIntent (backend-only, simple)
app.post(
  "/api/payment/create-payment-intent",
  async (req: Request, res: Response) => {
    const { amount, currency = "usd" } = req.body;

    if (!amount) {
      return res
        .status(400)
        .json({ success: false, message: "Amount is required" });
    }

    try {
      // For testing, use Stripe test PaymentMethod
      // Frontend can collect real card info later with Stripe Elements or Payment Sheet
      const paymentIntent = await stripe.paymentIntents.create({
        amount, // in cents
        currency,
        payment_method_types: ["card"],
        payment_method: "pm_card_visa", // Stripe test card
        confirm: true, // immediately confirm the payment
      });

      return res.json({ success: true, paymentIntent });
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ success: false, message: err.message });
    }
  },
);

// Retrieve PaymentIntent status
app.get("/api/payment/intent/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(id);
    return res.json({ success: true, paymentIntent });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// ===============================
// Test route
// ===============================
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Restaurant API is running" });
});

// ===============================
// Database + Server Start
// ===============================
(async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log("Database connected and synced");

    const PORT: number = Number(process.env.PORT) || 8000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("DB connection failed:", err);
  }
})();
