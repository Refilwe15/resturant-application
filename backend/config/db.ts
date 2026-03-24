import { Sequelize } from "sequelize";

const DATABASE_URL = process.env.DATABASE_URL  || `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_URL}`;

export const sequelize = new Sequelize(DATABASE_URL, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: false,
});

export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ PostgreSQL connection established successfully.");
  } catch (error) {
    console.error("❌ Unable to connect to PostgreSQL:", error);
  }
};