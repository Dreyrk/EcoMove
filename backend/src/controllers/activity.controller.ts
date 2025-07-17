import { Request, Response, NextFunction } from "express";
import activityService from "../services/activity.service";
import { getPagination } from "../utils/pagination";
import { successResponse } from "../utils/response";
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
        throw new AppError(`Erreur serveur: ${(e as Error).message}`, 500);
      }
    }
  }

  async getAllActivities(req: Request, res: Response, next: NextFunction) {
    try {
      const pagination = getPagination(req);

      const { data, meta } = await activityService.getAllActivities(pagination);

      res.status(200).json(successResponse(data, meta));
    } catch (e) {
      throw new AppError(`Erreur serveur: ${(e as Error).message}`, 500);
    }
  }

  async getActivitiesByUserId(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;

      const id = Number(userId);

      const user = userService.getUserById(id);

      if (!user) {
        throw new AppError("Utilisateur non trouvé", 404);
      }

      const pagination = getPagination(req);

      const activities = await activityService.getActivitiesByUserId(id, pagination);

      res.status(200).json(successResponse(activities));
    } catch (e) {
      throw new AppError(`Erreur serveur: ${(e as Error).message}`, 500);
    }
  }

  async deleteActivity(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await activityService.deleteActivity(Number(id));
      res.status(204).send();
    } catch (e) {
      throw new AppError(`Erreur serveur: ${(e as Error).message}`, 500);
    }
  }
}

export default new ActivityController();
