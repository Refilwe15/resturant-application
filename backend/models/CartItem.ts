import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.ts";
import { User } from "./User.ts";
import { FoodItem } from "./FoodItem.ts";

export class CartItem extends Model {
  public id!: string;
  public quantity!: number;
  public selectedExtras!: object[];
}

CartItem.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    selectedExtras: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
  },
  {
    sequelize,
    tableName: "cart_items",
    modelName: "CartItem",
  },
);

User.hasMany(CartItem, { foreignKey: "userId" });
CartItem.belongsTo(User, { foreignKey: "userId" });

FoodItem.hasMany(CartItem, { foreignKey: "foodItemId" });
CartItem.belongsTo(FoodItem, { foreignKey: "foodItemId" });
