import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db";
import { User } from "./User";

export class Order extends Model {
  public id!: string;
  public items!: object[];
  public totalPrice!: number;
  public deliveryAddress?: string;
  public paymentStatus!: string;
  public orderStatus!: string;
}

Order.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    items: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    totalPrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    deliveryAddress: {
      type: DataTypes.TEXT,
    },
    paymentStatus: {
      type: DataTypes.STRING,
      defaultValue: "pending",
    },
    orderStatus: {
      type: DataTypes.STRING,
      defaultValue: "processing",
    },
  },
  {
    sequelize,
    tableName: "orders",
    modelName: "Order",
  }
);

User.hasMany(Order, { foreignKey: "userId" });
Order.belongsTo(User, { foreignKey: "userId" });