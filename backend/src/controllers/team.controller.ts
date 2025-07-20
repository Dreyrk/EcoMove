import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import teamService from "../services/team.service";
import { getPagination } from "../utils/pagination";
import { successResponse } from "../utils/response";
import { AppError } from "../middlewares/error.middleware";
import { TeamSchema } from "../schemas/team.schema";
import { formatZodErrors } from "../utils/formatZodErrors";

class TeamController {
  // Récupère toutes les équipes avec pagination
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const pagination = getPagination(req);
      const { data, meta } = await teamService.getAllTeams(pagination);
      res.status(200).json(successResponse(data, meta));
    } catch (error) {
      if (error instanceof AppError) {
        return next(error);
      }
      next(new AppError("Erreur interne du serveur", 500, "INTERNAL_SERVER_ERROR"));
    }
  }

  // Récupère une équipe spécifique par son ID
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const team = await teamService.getTeamById(Number(req.params.id));
      if (!team) {
        throw new AppError("Équipe non trouvée", 404, "TEAM_NOT_FOUND");
      }
      res.status(200).json(successResponse(team));
    } catch (error) {
      if (error instanceof AppError) {
        return next(error);
      }
      next(new AppError("Erreur interne du serveur", 500, "INTERNAL_SERVER_ERROR"));
    }
  }

  // Crée une nouvelle équipe avec validation des données
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = TeamSchema.parse(req.body);
      const { name, description } = validatedData;
      const team = await teamService.createTeam(name, description);
      res.status(201).json(successResponse(team));
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = formatZodErrors(error);
        throw new AppError(`Erreur de validation : ${errorMessages.join("; ")}`, 400, "VALIDATION_ERROR");
      } else {
        if (error instanceof AppError) {
          return next(error);
        }
        next(new AppError("Erreur interne du serveur", 500, "INTERNAL_SERVER_ERROR"));
      }
    }
  }

  // Met à jour une équipe existante avec validation des données
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = TeamSchema.parse(req.body);
      const { name, description } = validatedData;
      const team = await teamService.updateTeam(Number(req.params.id), name, description);
      if (!team) {
        throw new AppError("Équipe non trouvée", 404, "TEAM_NOT_FOUND");
      }
      res.status(200).json(successResponse(team));
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = formatZodErrors(error);
        throw new AppError(`Erreur de validation : ${errorMessages.join("; ")}`, 400, "VALIDATION_ERROR");
      } else {
        if (error instanceof AppError) {
          return next(error);
        }
        next(new AppError("Erreur interne du serveur", 500, "INTERNAL_SERVER_ERROR"));
      }
    }
  }

  // Supprime une équipe par son ID
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const success = await teamService.deleteTeam(Number(req.params.id));
      if (!success) {
        throw new AppError("Équipe non trouvée", 404, "TEAM_NOT_FOUND");
      }
      res.status(200).json(successResponse(null, { message: "Équipe supprimée avec succès" }));
    } catch (error) {
      if (error instanceof AppError) {
        return next(error);
      }
      next(new AppError("Erreur interne du serveur", 500, "INTERNAL_SERVER_ERROR"));
    }
  }
}

export default new TeamController();
