import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import db from "../lib/db";
import userService from "./user.service";
import { getJwtSecret } from "../utils/env";

class AuthService {
  private db: PrismaClient;

  constructor() {
    this.db = db;
  }

  async register({ name, email, password, teamId }: { name: string; email: string; password: string; teamId: number }) {
    const existing = await userService.getUserByEmail(email);
    if (existing) throw new Error("Email already registered");

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userService.createUser({ name, email, password: hashedPassword, teamId });

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async login({ email, password }: { email: string; password: string }) {
    const user = await userService.getUserByEmail(email);
    if (!user) throw new Error("Invalid credentials");

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new Error("Invalid credentials");

    const JWT_SECRET = getJwtSecret();

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
    return token;
  }
}

export default new AuthService();
