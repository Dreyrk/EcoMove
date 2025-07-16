import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import db from "../lib/db";
import userService from "./user.service";
import { getJwtSecret } from "../utils/env";
import { AppError } from "../middlewares/error.middleware";

class AuthService {
  private db: PrismaClient;

  constructor() {
    this.db = db;
  }

  async register({ name, email, password, teamId }: { name: string; email: string; password: string; teamId: number }) {
    const existing = await userService.getUserByEmail(email);
    if (existing) throw new AppError("Email already registered", 409);

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userService.createUser({ name, email, password: hashedPassword, teamId });

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async login({ email, password }: { email: string; password: string }) {
    const user = await userService.getUserByEmail(email);
    if (!user) throw new AppError("Invalid credentials", 400);

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new AppError("Invalid credentials", 400);

    const JWT_SECRET = getJwtSecret();

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
    return token;
  }
}

export default new AuthService();
