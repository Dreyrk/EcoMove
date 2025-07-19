import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserRoleType } from "@prisma/client";
import { getJwtSecret } from "../utils/env";
import { AppError } from "./error.middleware";

// Interface pour typage strict du payload JWT
interface TokenPayload {
  id: string;
  role: UserRoleType;
  iat?: number; // Issued at (optionnel)
  exp?: number; // Expiration (optionnel)
}

class AuthMiddleware {
  // Middleware pour vérifier l'authentification via un token JWT
  verifyToken = (req: Request, res: Response, next: NextFunction) => {
    // Récupération du token depuis les cookies ou l'en-tête Authorization
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    // Vérification de la présence du token
    if (!token) {
      throw new AppError("Authentification requise : aucun token fourni", 401);
    }

    try {
      // Validation du token avec la clé secrète
      const secret = getJwtSecret();
      if (!secret) {
        throw new AppError("Clé secrète JWT non définie", 500);
      }

      // Vérification et décodage du token
      const decoded = jwt.verify(token, secret) as TokenPayload;

      // Ajout des informations de l'utilisateur à la requête
      req.user = {
        id: Number(decoded.id),
        role: decoded.role,
      };

      next();
    } catch (error) {
      // Gestion des erreurs spécifiques pour les tokens JWT
      if (error instanceof jwt.TokenExpiredError) {
        throw new AppError("Token expiré", 401);
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new AppError("Token invalide", 401);
      }
      throw new AppError("Erreur serveur lors de la vérification du token", 500);
    }
  };

  // Middleware pour restreindre l'accès aux administrateurs
  restrictToAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== UserRoleType.ADMIN) {
      throw new AppError("Accès réservé aux administrateurs", 403);
    }
    next();
  };
}

export default new AuthMiddleware();
