import { Request } from "express";
import { User } from "../models/User.ts";

export interface AuthRequest extends Request {
  user?: User;
}
