require("dotenv").config();

import type { Request, Response } from "express";

const express = require("express") as typeof import("express");
const cors = require("cors") as typeof import("cors");
const { sequelize } = require("./config/db");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const foodRoutes = require("./routes/foods");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/orders");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.get("/", (req: Request, res: Response): void => {
  res.json({ message: "Restaurant API is running" });
});

// Connect to Postgres
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Database connected and synced");

    const PORT: number = Number(process.env.PORT) || 8000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err: unknown) => {
    console.error("DB connection failed:", err);
  });
