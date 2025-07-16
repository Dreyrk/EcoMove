import { Request, Response, NextFunction } from "express";
import activityService from "../services/activity.service";
import { getPagination } from "../utils/pagination";
import { errorResponse, successResponse } from "../utils/response";
import userService from "../services/user.service";
import { ActivitySchema } from "../schemas/activity.schema";
import { AppError } from "../middlewares/error.middleware";

class ActivityController {
  async createActivity(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = ActivitySchema.parse(req.body);

      const { userId, date, type, steps, distanceKm } = validatedData;

      const activity = await activityService.createActivity(userId, new Date(date), type, steps, distanceKm);

      res.status(201).json(successResponse(activity));
    } catch (e: any) {
      if (e.name === "ZodError") {
        const errorMessages = e.errors.map((err: any) => err.message);
        next(new AppError(errorMessages.join(", "), 400));
      } else {
        next(e);
      }
    }
  }

  async getAllActivities(req: Request, res: Response, next: NextFunction) {
    try {
      const pagination = getPagination(req);

      const { data, meta } = await activityService.getAllActivities(pagination);

      res.status(200).json(successResponse(data, meta));
    } catch (e) {
      next(e);
    }
  }

  async getActivitiesByUserId(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;

      const id = Number(userId);

      const user = userService.getUserById(id);

      if (!user) {
        res.status(404).json(errorResponse("Utilisateur non trouvé"));
      }

      const pagination = getPagination(req);

      const activities = await activityService.getActivitiesByUserId(id, pagination);

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
