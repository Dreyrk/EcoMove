import { NextFunction, Request, Response } from "express";
import activityService from "../services/activity.service";
import { getPagination } from "../utils/pagination";
import { successResponse } from "../utils/response";
import userService from "../services/user.service";
import { ActivitySchema } from "../schemas/activity.schema";
import { AppError } from "../middlewares/error.middleware";
import { formatZodErrors } from "../utils/formatZodErrors";
class ActivityController {
  // Crée une nouvelle activité avec validation
  async createActivity(req: Request, res: Response, next: NextFunction) {
    try {
      // Vérifier l'utilisateur authentifié
      if (!req.user) {
        throw new AppError("Utilisateur non connecté", 401, "UNAUTHORIZED");
      }

      // Valider les données d'entrée
      const validatedData = ActivitySchema.safeParse(req.body);
      if (!validatedData.success) {
        throw new AppError(formatZodErrors(validatedData.error).join(", "), 400, "VALIDATION_ERROR");
      }

      const { userId, date, type, steps, distanceKm } = validatedData.data;

      // Vérifier que l'utilisateur crée une activité pour lui-même (ou est admin)
      if (req.user.id !== userId && req.user.role !== "ADMIN") {
        throw new AppError("Accès non autorisé", 403, "UNAUTHORIZED");
      }

      const activity = await activityService.createActivity(userId, date, type, distanceKm, steps);
      res.status(201).json(successResponse(activity));
    } catch (error) {
      if (error instanceof AppError) {
        return next(error);
      }
      next(new AppError("Erreur interne du serveur", 500, "INTERNAL_SERVER_ERROR"));
    }
  }

  // Récupère toutes les activités avec pagination
  async getAllActivities(req: Request, res: Response, next: NextFunction) {
    try {
      const pagination = getPagination(req);
      const { data, meta } = await activityService.getAllActivities(pagination);
      res.status(200).json(successResponse(data, meta));
    } catch (error) {
      if (error instanceof AppError) {
        return next(error);
      }
      next(new AppError("Erreur interne du serveur", 500, "INTERNAL_SERVER_ERROR"));
    }
  }

  // Récupère les activités d'un utilisateur avec pagination
  async getActivitiesByUserId(req: Request, res: Response, next: NextFunction) {
    try {
      // Vérifier l'utilisateur authentifié
      if (!req.user) {
        throw new AppError("Utilisateur non connecté", 401, "UNAUTHORIZED");
      }

      const userId = Number(req.params.userId);

      // Vérifier que l'utilisateur accède à ses propres activités (ou est admin)
      if (req.user.id !== userId && req.user.role !== "ADMIN") {
        throw new AppError("Accès non autorisé", 403, "UNAUTHORIZED");
      }

      const user = await userService.getUserById(userId);
      if (!user) {
        throw new AppError("Utilisateur non trouvé", 404, "USER_NOT_FOUND");
      }

      const pagination = getPagination(req);
      const { data, meta } = await activityService.getActivitiesByUserId(userId, pagination);
      res.status(200).json(successResponse(data, meta));
    } catch (error) {
      if (error instanceof AppError) {
        return next(error);
      }
      next(new AppError("Erreur interne du serveur", 500, "INTERNAL_SERVER_ERROR"));
    }
  }

  // Supprime une activité par ID
  async deleteActivity(req: Request, res: Response, next: NextFunction) {
    try {
      // Vérifier l'utilisateur authentifié
      if (!req.user) {
        throw new AppError("Utilisateur non connecté", 401, "UNAUTHORIZED");
      }

      const id = Number(req.params.id);

      // Vérifier que l'utilisateur est autorisé à supprimer l'activité
      const activity = await activityService.getActivityById(id);
      if (!activity) {
        throw new AppError("Activité non trouvée", 404, "ACTIVITY_NOT_FOUND");
      }
      if (req.user.id !== activity.userId && req.user.role !== "ADMIN") {
        throw new AppError("Accès non autorisé", 403, "UNAUTHORIZED");
      }

      await activityService.deleteActivity(id);
      res.status(200).json(successResponse(null, { message: "Activité supprimée avec succès" }));
    } catch (error) {
      if (error instanceof AppError) {
        return next(error);
      }
      next(new AppError("Erreur interne du serveur", 500, "INTERNAL_SERVER_ERROR"));
    }
  }
}

export default new ActivityController();
