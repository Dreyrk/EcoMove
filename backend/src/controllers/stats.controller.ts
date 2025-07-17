import { NextFunction, Request, Response } from "express";
import statsService from "../services/stats.service";
import { getPagination } from "../utils/pagination";
import { successResponse } from "../utils/response";
import { AppError } from "../middlewares/error.middleware";

class StatsController {
  async getGeneralStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await statsService.getGeneralStats();
      res.status(200).json(successResponse(stats));
    } catch (e) {
      throw new AppError(`Erreur serveur: ${(e as Error).message}`, 500);
    }
  }

  async getIndividualRankings(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await statsService.getIndividualRankings();
      res.status(200).json(successResponse(stats));
    } catch (e) {
      throw new AppError(`Erreur serveur: ${(e as Error).message}`, 500);
    }
  }

  async getTeamRankings(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await statsService.getTeamRankings();
      res.status(200).json(successResponse(stats));
    } catch (e) {
      throw new AppError(`Erreur serveur: ${(e as Error).message}`, 500);
    }
  }

  async getUserStats(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (Number(id) !== req.user?.id) {
        throw new AppError("Unauthorized", 403);
      }
      const stats = await statsService.getUserStats(Number(id));
      res.status(200).json(successResponse(stats));
    } catch (e) {
      throw new AppError(`Erreur serveur: ${(e as Error).message}`, 500);
    }
  }

  async getUserProgress(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const pagination = getPagination(req);
      const stats = await statsService.getUserProgress(Number(id), pagination);
      res.status(200).json(successResponse(stats.data, stats.meta));
    } catch (e) {
      throw new AppError(`Erreur serveur: ${(e as Error).message}`, 500);
    }
  }
}

export default new StatsController();
