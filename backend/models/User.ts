import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.ts";
import bcrypt from "bcryptjs";

export class User extends Model {
  public id!: string;
  public name!: string;
  public surname?: string;
  public email!: string;
  public password!: string;
  public contactNumber?: string;
  public address?: string;
  public cardDetails?: string;
  public isAdmin!: boolean;

  public async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}

User.init(
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
    surname: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contactNumber: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.TEXT,
    },
    cardDetails: {
      type: DataTypes.STRING,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: "users",
    modelName: "User",
    hooks: {
      beforeCreate: async (user: User) => {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      },
    },
  },
);
