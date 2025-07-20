import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient, UserRoleType } from "@prisma/client";
import db from "../lib/db";
import userService, { SelectedUser, UserWithoutPassword } from "./user.service";
import { getJwtSecret } from "../utils/env";
import { AppError } from "../middlewares/error.middleware";

class AuthService {
  private db: PrismaClient;

  constructor() {
    this.db = db;
  }

  // Inscrit un nouvel utilisateur avec validation et hachage du mot de passe
  async register({
    name,
    email,
    password,
    teamId,
    role,
  }: {
    name: string;
    email: string;
    password: string;
    teamId: number;
    role?: UserRoleType;
  }): Promise<UserWithoutPassword> {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const userWithoutPassword = await userService.createUser({
        name,
        email,
        password: hashedPassword,
        teamId,
        role,
      });
      return userWithoutPassword;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("Erreur lors de l'inscription", 500, "REGISTRATION_ERROR");
    }
  }

  // Connecte un utilisateur et génère un JWT
  async login({ email, password }: { email: string; password: string }): Promise<{
    token: string;
    user: SelectedUser;
  }> {
    try {
      const user = await userService.getUserByEmail(email);
      if (!user) {
        throw new AppError("Email invalide", 400, "INVALID_EMAIL");
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        throw new AppError("Mot de passe invalide", 400, "INVALID_PASSWORD");
      }

      const JWT_SECRET = getJwtSecret();
      const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });

      return {
        token,
        user,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("Erreur lors de la connexion", 500, "LOGIN_ERROR");
    }
  }
}

export default new AuthService();
