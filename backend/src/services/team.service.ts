import { PrismaClient, Team } from "@prisma/client";
import db from "../lib/db";
import { AppError } from "../middlewares/error.middleware";
import { DataResponse } from "../types";
import { PaginationParams } from "../utils/pagination";

class TeamService {
  private db: PrismaClient;

  constructor() {
    this.db = db;
  }

  async getAllTeams(paginationMeta: PaginationParams): Promise<{ data: Team[]; total: number }> {
    try {
      const { skip, take, page, per_page } = paginationMeta;

      const [teams, total] = await Promise.all([
        this.db.team.findMany({
          skip,
          take,
          orderBy: { id: "asc" },
        }),
        this.db.team.count(),
      ]);

      return {
        data: teams,
        total,
      };
    } catch (error) {
      throw new AppError("Failed to fetch teams", 500);
    }
  }

  async getTeamById(id: number) {
    try {
      const team = await this.db.team.findUnique({
        where: { id },
      });

      if (!team) {
        throw new AppError("Team not found", 404);
      }

      return team;
    } catch (error) {
      throw new AppError("Failed to fetch team", 500);
    }
  }

  async createTeam(name: string, description?: string) {
    try {
      return await this.db.team.create({
        data: {
          name,
          description,
        },
      });
    } catch (error) {
      throw new AppError("Failed to create team", 500);
    }
  }

  async updateTeam(id: number, name?: string, description?: string) {
    try {
      return await this.db.team.update({
        where: { id },
        data: {
          name,
          description,
        },
      });
    } catch (error) {
      throw new AppError("Failed to update team", 500);
    }
  }

  async deleteTeam(id: number) {
    try {
      return await this.db.team.delete({
        where: { id },
      });
    } catch (error) {
      throw new AppError("Failed to delete team", 500);
    }
  }
}

export default new TeamService();
