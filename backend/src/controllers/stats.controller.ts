import { Request, Response } from "express";
import statsService from "../services/stats.service";
import { getPagination } from "../utils/pagination";

class StatsController {
  async getGeneralStats(req: Request, res: Response) {
    const stats = await statsService.getGeneralStats();
    res.json({ status: "success", data: stats });
  }

  async getIndividualRankings(req: Request, res: Response) {
    const stats = await statsService.getIndividualRankings();
    res.json({ status: "success", data: stats });
  }

  async getTeamRankings(req: Request, res: Response) {
    const stats = await statsService.getTeamRankings();
    res.json({ status: "success", data: stats });
  }

  async getUserStats(req: Request, res: Response) {
    const { id } = req.params;
    const stats = await statsService.getUserStats(Number(id));
    res.json({ status: "success", data: stats });
  }

  async getUserProgress(req: Request, res: Response) {
    const { id } = req.params;
    const pagination = getPagination(req);
    const stats = await statsService.getUserProgress(Number(id), pagination);
    res.json({ status: "success", data: stats });
  }
}

export default new StatsController();
