import { Request, Response, NextFunction } from "express";
import activityService from "../services/activity.service";
import { getPagination } from "../utils/pagination";
import { successResponse } from "../utils/response";

class ActivityController {
  async createActivity(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, date, type, steps, distanceKm } = req.body;

      const activity = await activityService.createActivity(userId, new Date(date), type, steps, distanceKm);

      res.status(201).json(successResponse(activity));
    } catch (e) {
      next(e);
    }
  }

  async getAllActivities(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, perPage, skip, take } = getPagination(req);

      const { data, meta } = await activityService.getAllActivities(page, perPage, skip, take);

      res.status(200).json(successResponse(data, meta));
    } catch (e) {
      next(e);
    }
  }

  async getActivitiesByUserId(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;

      const id = Number(userId);
      const activities = await activityService.getActivitiesByUserId(id);

      res.status(200).json(successResponse(activities));
    } catch (e) {
      next(e);
    }
  }

  async deleteActivity(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await activityService.deleteActivity(Number(id));
      res.status(204).send();
    } catch (e) {
      next(e);
    }
  }
}

export default new ActivityController();
