import { Request, Response } from "express";
import statsService from "../services/stats.service";

class StatsController {
  async getGeneralStats(req: Request, res: Response) {
    const stats = await statsService.getGeneralStats();
    res.json({ status: "success", data: stats });
  }

  async getTeamStats(req: Request, res: Response) {
    const stats = await statsService.getTeamStats();
    res.json({ status: "success", data: stats });
  }

  async getUserStats(req: Request, res: Response) {
    const stats = await statsService.getUserStats();
    res.json({ status: "success", data: stats });
  }
}

export default new StatsController();
