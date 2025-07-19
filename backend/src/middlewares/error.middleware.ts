// Importation des dépendances nécessaires
import { Request, Response, NextFunction } from "express";
import { errorResponse } from "../utils/response";

// Interface pour typage strict des erreurs personnalisées
interface AppErrorInterface extends Error {
  status: number;
  code?: string; // Code d'erreur interne optionnel pour le suivi
}

// Classe d'erreur personnalisée pour gérer les erreurs spécifiques de l'application
export class AppError extends Error implements AppErrorInterface {
  public status: number;
  public code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
    this.name = "AppError";
    Error.captureStackTrace(this, this.constructor);
  }
}

// Middleware de gestion des erreurs globales
export const errorHandler = (err: AppError | Error, req: Request, res: Response, next: NextFunction) => {
  // Log de l'erreur pour le débogage (à remplacer par un logger comme winston en production)
  console.error({
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method,
    error: err.message,
    stack: err.stack,
  });

  // Déterminer le code de statut et le message
  const statusCode = err instanceof AppError ? err.status : 500;
  const message =
    err instanceof AppError || process.env.NODE_ENV !== "production" ? err.message : "Erreur interne du serveur"; // Masquer les détails en production

  // Réponse JSON standardisée
  res.status(statusCode).json(
    errorResponse(message, {
      code: err instanceof AppError ? err.code : undefined,
    })
  );
};
