// Importation des dépendances nécessaires
import { Request, Response, NextFunction } from "express";
import authService from "../services/auth.service";
import userService from "../services/user.service";
import { successResponse } from "../utils/response";
import { AppError } from "../middlewares/error.middleware";
import { UserSchema } from "../schemas/user.schema";
import { formatZodErrors } from "../utils/formatZodErrors";

// Schéma pour la connexion (email et mot de passe uniquement)
const LoginSchema = UserSchema.pick({ email: true, password: true });

class AuthController {
  // Récupère le profil de l'utilisateur authentifié
  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError("Utilisateur non connecté", 401, "UNAUTHORIZED");
      }
      const user = await userService.getUserById(req.user.id);
      if (!user) {
        throw new AppError("Utilisateur non trouvé", 404, "USER_NOT_FOUND");
      }
      res.status(200).json(successResponse(user));
    } catch (error) {
      throw new AppError((error as Error).message, 500);
    }
  }

  // Crée un nouvel utilisateur avec validation des données
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      // Valider les données d'entrée
      const parsed = UserSchema.safeParse(req.body);

      if (!parsed.success) {
        throw new AppError(formatZodErrors(parsed.error).join(", "), 400, "VALIDATION_ERROR");
      }

      const user = await authService.register(parsed.data);
      res.status(201).json(successResponse(user));
    } catch (error) {
      throw new AppError((error as Error).message, 500);
    }
  }

  // Connecte un utilisateur avec validation des données et définit un cookie JWT
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      // Valider les données d'entrée
      const parsed = LoginSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new AppError(formatZodErrors(parsed.error).join(", "), 400, "VALIDATION_ERROR");
      }

      const { token, user } = await authService.login(parsed.data);
      res
        .cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
          sameSite: "lax",
        })
        .status(200)
        .json(successResponse({ user }));
    } catch (error) {
      throw new AppError((error as Error).message, 500);
    }
  }

  // Déconnecte l'utilisateur authentifié en supprimant le cookie JWT
  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError("Utilisateur non connecté", 401, "UNAUTHORIZED");
      }
      res
        .clearCookie("token", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        })
        .status(200)
        .json(successResponse(null, { message: "Déconnexion réussie" }));
    } catch (error) {
      throw new AppError((error as Error).message, 500);
    }
  }
}

export default new AuthController();
