import { Request, Response } from "express";
import activityService from "../services/activity.service";

class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { userId, date, type, steps, distanceKm } = req.body;
      const activity = await activityService.createActivity(userId, new Date(date), type, steps, distanceKm);
      res.status(201).json(activity);
    } catch (error) {
      res.status(500).json({ error: "Failed to create activity" });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { userId, date, type, steps, distanceKm } = req.body;
      const activity = await activityService.createActivity(userId, new Date(date), type, steps, distanceKm);
      res.status(201).json(activity);
    } catch (error) {
      res.status(500).json({ error: "Failed to create activity" });
    }
  }
}

export default new AuthController();
