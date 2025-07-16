import { Request, Response, NextFunction } from "express";
import teamService from "../services/team.service";
import { getPagination } from "../utils/pagination";
import { successResponse } from "../utils/response";
import { AppError } from "../middlewares/error.middleware";
import { TeamSchema } from "../schemas/team.schema";

class TeamController {
  async getAllTeams(req: Request, res: Response, next: NextFunction) {
    try {
      const pagination = getPagination(req);
      const teams = await teamService.getAllTeams(pagination);
      res.status(200).json(successResponse(teams));
    } catch (error) {
      next(error);
    }
  }

  async getTeamById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const team = await teamService.getTeamById(Number(id));
      res.status(200).json(successResponse(team));
    } catch (error) {
      next(error);
    }
  }

  async createTeam(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = TeamSchema.parse(req.body);
      const { name, description } = validatedData;
      const team = await teamService.createTeam(name, description);
      res.status(201).json(successResponse(team));
    } catch (error: any) {
      if (error.name === "ZodError") {
        const errorMessages = error.errors.map((err: any) => err.message);
        next(new AppError(errorMessages.join(", "), 400));
      } else {
        next(error);
      }
    }
  }

  async updateTeam(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const validatedData = TeamSchema.parse(req.body);
      const { name, description } = validatedData;

      const team = await teamService.updateTeam(Number(id), name, description);
      res.status(200).json(successResponse(team));
    } catch (error: any) {
      if (error.name === "ZodError") {
        const errorMessages = error.errors.map((err: any) => err.message);
        next(new AppError(errorMessages.join(", "), 400));
      } else {
        next(error);
      }
    }
  }

  async deleteTeam(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await teamService.deleteTeam(Number(id));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default new TeamController();
