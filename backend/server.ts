import "dotenv/config";
import express, { Application, Request, Response } from "express";
import cors from "cors";

import { sequelize } from "./config/db.ts"; // ← Add .ts
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.ts"; // ← Add .ts

// Routes - add .ts to all these imports
import authRoutes from "./routes/auth.ts";
import userRoutes from "./routes/users.ts";
import foodRoutes from "./routes/foods.ts";
import cartRoutes from "./routes/cart.ts";
import orderRoutes from "./routes/orders.ts";

// App instance
const app: Application = express();

// ===============================
// Middleware
// ===============================
app.use(cors());
app.use(express.json());

// ===============================
// Routes
// ===============================
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

// ===============================
// Swagger UI
// ===============================
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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
