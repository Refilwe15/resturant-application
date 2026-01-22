import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/db.ts";

interface FoodItemAttributes {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  type: string;
  extras?: object[];
}

interface FoodItemCreationAttributes extends Optional<
  FoodItemAttributes,
  "id" | "description" | "image" | "extras"
> {}

export class FoodItem
  extends Model<FoodItemAttributes, FoodItemCreationAttributes>
  implements FoodItemAttributes
{
  public id!: string;
  public name!: string;
  public description?: string;
  public price!: number;
  public image?: string;
  public type!: string;
  public extras?: object[];
}

FoodItem.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    extras: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
  },
  {
    sequelize,
    tableName: "food_items",
    modelName: "FoodItem",
  },
);
