import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import userService from "../services/user.service";
import teamService from "../services/team.service";
import activityService from "../services/activity.service";
import { successResponse } from "../utils/response";
import { AppError } from "../middlewares/error.middleware";
import { formatZodErrors } from "../utils/formatZodErrors";
import { getPagination } from "../utils/pagination";
import { TeamSchema } from "../schemas/team.schema";

class AdminController {
  // Récupère tous les utilisateurs
  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const pagination = getPagination(req, 10);
      const users = await userService.getAllUsers(pagination);
      res.status(200).json(successResponse(users.data, users.meta));
    } catch (error) {
      if (error instanceof AppError) {
        next(error);
      }
      next(new AppError("Erreur lors de la récupération des utilisateurs", 500, "DATABASE_ERROR"));
    }
  }

  // Crée un utilisateur
  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password, teamId, role } = req.body;
      const UserSchema = z.object({
        name: z.string().min(1, "Le nom est requis"),
        email: z.email("Email invalide"),
        password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
        teamId: z.number().int().positive("L’ID de l’équipe doit être un entier positif"),
        role: z.enum(["USER", "ADMIN"]).default("USER"),
      });

      const validatedData = UserSchema.safeParse({ name, email, password, teamId: Number(teamId), role });
      if (!validatedData.success) {
        throw new AppError(`Erreur de validation : ${formatZodErrors(validatedData.error)}`, 400, "VALIDATION_ERROR");
      }

      const user = await userService.createUser(validatedData.data);
      res.status(201).json(successResponse(user));
    } catch (error) {
      if (error instanceof AppError) {
        next(error);
      }
      next(new AppError("Erreur lors de la création de l’utilisateur", 500, "DATABASE_ERROR"));
    }
  }

  // Met à jour un utilisateur
  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id) || id <= 0) {
        throw new AppError("L’ID doit être un entier positif", 400, "INVALID_ID");
      }
      const { name, email, teamId, role } = req.body;
      const UpdateUserSchema = z.object({
        name: z.string().min(1, "Le nom est requis").optional(),
        email: z.string().email("Email invalide").optional(),
        teamId: z.number().int().positive("L’ID de l’équipe doit être un entier positif").optional(),
        role: z.enum(["USER", "ADMIN"]).optional(),
      });

      const validatedData = UpdateUserSchema.safeParse({
        name,
        email,
        teamId: teamId ? Number(teamId) : undefined,
        role,
      });
      if (!validatedData.success) {
        throw new AppError(`Erreur de validation : ${formatZodErrors(validatedData.error)}`, 400, "VALIDATION_ERROR");
      }

      const user = await userService.updateUser(id, validatedData.data);
      res.status(200).json(successResponse(user));
    } catch (error) {
      if (error instanceof AppError) {
        next(error);
      }
      next(new AppError("Erreur lors de la mise à jour de l’utilisateur", 500, "DATABASE_ERROR"));
    }
  }

  // Supprime un utilisateur
  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id) || id <= 0) {
        throw new AppError("L’ID doit être un entier positif", 400, "INVALID_ID");
      }
      await userService.deleteUser(id);
      res.status(204).json(successResponse(null));
    } catch (error) {
      if (error instanceof AppError) {
        next(error);
      }
      next(new AppError("Erreur lors de la suppression de l’utilisateur", 500, "DATABASE_ERROR"));
    }
  }

  // Récupère toutes les équipes
  async getAllTeams(req: Request, res: Response, next: NextFunction) {
    try {
      const pagination = getPagination(req, 10);
      const teams = await teamService.getAllTeams(pagination);
      res.status(200).json(successResponse(teams.data, teams.meta));
    } catch (error) {
      if (error instanceof AppError) {
        next(error);
      }
      next(new AppError("Erreur lors de la récupération des équipes", 500, "DATABASE_ERROR"));
    }
  }

  // Crée une équipe
  async createTeam(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, description } = req.body;
      const TeamSchema = z.object({
        name: z.string().min(1, "Le nom est requis"),
        description: z.string().optional(),
      });

      const validatedData = TeamSchema.safeParse({ name, description });
      if (!validatedData.success) {
        throw new AppError(`Erreur de validation : ${formatZodErrors(validatedData.error)}`, 400, "VALIDATION_ERROR");
      }

      const team = await teamService.createTeam(validatedData.data.name, validatedData.data.description);
      res.status(201).json(successResponse(team));
    } catch (error) {
      if (error instanceof AppError) {
        next(error);
      }
      next(new AppError("Erreur lors de la création de l’équipe", 500, "DATABASE_ERROR"));
    }
  }

  // Met à jour une équipe
  async updateTeam(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id) || id <= 0) {
        throw new AppError("L’ID doit être un entier positif", 400, "INVALID_ID");
      }
      const { name, description } = req.body;

      const validatedData = TeamSchema.safeParse({ name, description });
      if (!validatedData.success) {
        throw new AppError(`Erreur de validation : ${formatZodErrors(validatedData.error)}`, 400, "VALIDATION_ERROR");
      }

      const team = await teamService.updateTeam(id, validatedData.data.name, validatedData.data.description);
      if (!team) {
        throw new AppError("Équipe non trouvée", 404, "TEAM_NOT_FOUND");
      }
      res.status(200).json(successResponse(team));
    } catch (error) {
      if (error instanceof AppError) {
        next(error);
      }
      next(new AppError("Erreur lors de la mise à jour de l’équipe", 500, "DATABASE_ERROR"));
    }
  }

  // Supprime une équipe
  async deleteTeam(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id) || id <= 0) {
        throw new AppError("L’ID doit être un entier positif", 400, "INVALID_ID");
      }
      const success = await teamService.deleteTeam(id);
      if (!success) {
        throw new AppError("Équipe non trouvée", 404, "TEAM_NOT_FOUND");
      }
      res.status(204).json(successResponse(null));
    } catch (error) {
      if (error instanceof AppError) {
        next(error);
      }
      next(new AppError("Erreur lors de la suppression de l’équipe", 500, "DATABASE_ERROR"));
    }
  }

  // Récupère toutes les activités
  async getAllActivities(req: Request, res: Response, next: NextFunction) {
    try {
      const pagination = getPagination(req, 10);
      const activities = await activityService.getAllActivities(pagination);
      res.status(200).json(successResponse(activities.data, activities.meta));
    } catch (error) {
      if (error instanceof AppError) {
        next(error);
      }
      next(new AppError("Erreur lors de la récupération des activités", 500, "DATABASE_ERROR"));
    }
  }

  // Crée une activité
  async createActivity(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, date, type, distanceKm, steps } = req.body;
      const ActivitySchema = z.object({
        userId: z.number().int().positive("L’ID de l’utilisateur doit être un entier positif"),
        date: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, "Format de date invalide (DD/MM/YYYY)"),
        type: z.enum(["VELO", "MARCHE"], { message: "Type d’activité invalide" }),
        distanceKm: z.number().positive("La distance doit être positive"),
        steps: z.number().int().positive("Le nombre de pas doit être un entier positif").optional(),
      });

      const validatedData = ActivitySchema.safeParse({
        userId: Number(userId),
        date,
        type,
        distanceKm: Number(distanceKm),
        steps: steps ? Number(steps) : undefined,
      });
      if (!validatedData.success) {
        throw new AppError(`Erreur de validation : ${formatZodErrors(validatedData.error)}`, 400, "VALIDATION_ERROR");
      }

      const activity = await activityService.createActivity(
        validatedData.data.userId,
        validatedData.data.date,
        validatedData.data.type,
        validatedData.data.distanceKm,
        validatedData.data.steps
      );
      res.status(201).json(successResponse(activity));
    } catch (error) {
      if (error instanceof AppError) {
        next(error);
      }
      next(new AppError("Erreur lors de la création de l’activité", 500, "DATABASE_ERROR"));
    }
  }

  // Met à jour une activité
  async updateActivity(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id) || id <= 0) {
        throw new AppError("L’ID doit être un entier positif", 400, "INVALID_ID");
      }
      const { userId, date, type, distanceKm, steps } = req.body;
      const ActivitySchema = z.object({
        user: z.object({ id: z.number() }),
        date: z
          .string()
          .regex(/^\d{2}\/\d{2}\/\d{4}$/, "Format de date invalide (DD/MM/YYYY)")
          .optional(),
        type: z.enum(["VELO", "MARCHE"], { message: "Type d’activité invalide" }).optional(),
        distanceKm: z.number().positive("La distance doit être positive").optional(),
        steps: z.number().int().positive("Le nombre de pas doit être un entier positif").optional(),
      });

      const validatedData = ActivitySchema.safeParse({
        userId: userId ? Number(userId) : undefined,
        date,
        type,
        distanceKm: distanceKm ? Number(distanceKm) : undefined,
        steps: steps ? Number(steps) : undefined,
      });
      if (!validatedData.success) {
        throw new AppError(`Erreur de validation : ${formatZodErrors(validatedData.error)}`, 400, "VALIDATION_ERROR");
      }

      const activity = await activityService.updateActivity(id, {
        user: validatedData.data.user,
        dateString: validatedData.data.date,
        type: validatedData.data.type,
        distanceKm: validatedData.data.distanceKm,
        steps: validatedData.data.steps,
      });
      res.status(200).json(successResponse(activity));
    } catch (error) {
      if (error instanceof AppError) {
        next(error);
      }
      next(new AppError("Erreur lors de la mise à jour de l’activité", 500, "DATABASE_ERROR"));
    }
  }

  // Supprime une activité
  async deleteActivity(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id) || id <= 0) {
        throw new AppError("L’ID doit être un entier positif", 400, "INVALID_ID");
      }
      await activityService.deleteActivity(id);
      res.status(204).json(successResponse(null));
    } catch (error) {
      if (error instanceof AppError) {
        next(error);
      }
      next(new AppError("Erreur lors de la suppression de l’activité", 500, "DATABASE_ERROR"));
    }
  }
}

export default new AdminController();
