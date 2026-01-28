

/*
import { Sequelize } from "sequelize";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Sequelize for SQLite
export const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(__dirname, "../database.sqlite"), // Local DB file
  logging: false,
});

// Test connection
export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ SQLite connection has been established successfully.");
  } catch (error) {
    console.error("❌ Unable to connect to SQLite:", error);
  }
};

*/
