import { Request, Response, NextFunction } from "express";
import statsService from "../services/stats.service";
import { getPagination } from "../utils/pagination";
import { successResponse } from "../utils/response";
import { AppError } from "../middlewares/error.middleware";

class StatsController {
  // Récupère les statistiques globales du challenge
  async getGeneralStats(req: Request, res: Response) {
    try {
      const stats = await statsService.getGeneralStats();
      res.status(200).json(successResponse(stats));
    } catch (error) {
      throw new AppError("Erreur lors de la récupération des statistiques globales", 500, "DATABASE_ERROR");
    }
  }

  // Récupère le classement des équipes
  async getTeamRankings(req: Request, res: Response) {
    try {
      const pagination = getPagination(req);
      const { data, meta } = await statsService.getTeamRankings(pagination, true);
      res.status(200).json(successResponse(data, meta));
    } catch (error) {
      throw new AppError("Erreur lors de la récupération du classement des équipes", 500, "DATABASE_ERROR");
    }
  }

  // Récupère le classement individuel des utilisateurs
  async getIndividualRankings(req: Request, res: Response) {
    try {
      const pagination = getPagination(req);
      const { data, meta } = await statsService.getIndividualRankings(pagination, true);
      res.status(200).json(successResponse(data, meta));
    } catch (error) {
      throw new AppError("Erreur lors de la récupération du classement individuel", 500, "DATABASE_ERROR");
    }
  }

  // Récupère les statistiques d’un utilisateur spécifique
  async getUserStats(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id) || id <= 0) {
        throw new AppError("L'ID doit être un entier positif", 400, "INVALID_ID");
      }
      // Vérifie que l'utilisateur a accès à ses propres stats ou est admin
      if (!req.user || (req.user.id !== id && req.user.role !== "ADMIN")) {
        throw new AppError("Accès non autorisé", 403, "UNAUTHORIZED");
      }
      const stats = await statsService.getUserStats(id);
      if (!stats) {
        throw new AppError("Utilisateur non trouvé", 404, "USER_NOT_FOUND");
      }
      res.status(200).json(successResponse(stats));
    } catch (error) {
      throw new AppError((error as Error).message, 500);
    }
  }

  // Récupère la progression d’un utilisateur avec pagination
  async getUserProgress(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id) || id <= 0) {
        throw new AppError("L'ID doit être un entier positif", 400, "INVALID_ID");
      }
      // Vérifie que l'utilisateur a accès à sa propre progression ou est admin
      if (!req.user || (req.user.id !== id && req.user.role !== "ADMIN")) {
        throw new AppError("Accès non autorisé", 403, "UNAUTHORIZED");
      }
      const stats = await statsService.getUserProgress(id, getPagination(req));
      if (!stats) {
        throw new AppError("Utilisateur non trouvé", 404, "USER_NOT_FOUND");
      }
      res.status(200).json(successResponse(stats.data, stats.meta));
    } catch (error) {
      throw new AppError((error as Error).message, 500);
    }
  }
}

export default new StatsController();
