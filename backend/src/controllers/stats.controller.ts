import { NextFunction, Request, Response } from "express";
import statsService from "../services/stats.service";
import { getPagination } from "../utils/pagination";
import { successResponse } from "../utils/response";

class StatsController {
  async getGeneralStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await statsService.getGeneralStats();
      res.json(successResponse(stats));
    } catch (e) {
      next(e);
    }
  }

  async getIndividualRankings(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await statsService.getIndividualRankings();
      res.json(successResponse(stats));
    } catch (e) {
      next(e);
    }
  }

  async getTeamRankings(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await statsService.getTeamRankings();
      res.json(successResponse(stats));
    } catch (e) {
      next(e);
    }
  }

  async getUserStats(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const stats = await statsService.getUserStats(Number(id));
      res.json(successResponse(stats));
    } catch (e) {
      next(e);
    }
  }

  async getUserProgress(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const pagination = getPagination(req);
      const stats = await statsService.getUserProgress(Number(id), pagination);
      res.json(successResponse(stats.data, stats.meta));
    } catch (e) {
      next(e);
    }
  }
}

export default new StatsController();
