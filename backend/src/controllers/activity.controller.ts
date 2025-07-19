import { Request, Response } from "express";
import { flattenError } from "zod";
import activityService from "../services/activity.service";
import { getPagination } from "../utils/pagination";
import { successResponse } from "../utils/response";
import userService from "../services/user.service";
import { ActivitySchema } from "../schemas/activity.schema";
import { AppError } from "../middlewares/error.middleware";

class ActivityController {
  async createActivity(req: Request, res: Response) {
    try {
      const validatedData = ActivitySchema.safeParse(req.body);

      if (!validatedData.success) {
        const errorMessages = Object.values(flattenError(validatedData.error).fieldErrors).join(", ");
        throw new AppError(errorMessages, 400);
      }

      const { userId, date, type, steps, distanceKm } = validatedData.data;

      const activity = await activityService.createActivity(userId, date, type, distanceKm, steps);

      res.status(201).json(successResponse(activity));
    } catch (e: any) {
      throw new AppError(`${(e as Error).message}`, 500);
    }
  }

  async getAllActivities(req: Request, res: Response) {
    try {
      const pagination = getPagination(req);

      const { data, meta } = await activityService.getAllActivities(pagination);

      res.status(200).json(successResponse(data, meta));
    } catch (e) {
      throw new AppError(`${(e as Error).message}`, 500);
    }
  }

  async getActivitiesByUserId(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      const id = Number(userId);

      const user = userService.getUserById(id);

      if (!user) {
        throw new AppError("Utilisateur non trouvé", 404);
      }

      const pagination = getPagination(req);

      const activities = await activityService.getActivitiesByUserId(id, pagination);

      res.status(200).json(successResponse(activities.data, activities.meta));
    } catch (e) {
      throw new AppError(`${(e as Error).message}`, 500);
    }
  }

  async deleteActivity(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await activityService.deleteActivity(Number(id));
      res.status(204).send();
    } catch (e) {
      throw new AppError(`${(e as Error).message}`, 500);
    }
  }
}

export default new ActivityController();
