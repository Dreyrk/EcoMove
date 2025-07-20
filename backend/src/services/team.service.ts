import { PrismaClient, Team } from "@prisma/client";
import { AppError } from "../middlewares/error.middleware";
import db from "../lib/db";
import { PaginationParams } from "../utils/pagination";
import { DataResponse } from "../types";

class TeamService {
  private db: PrismaClient;

  constructor() {
    this.db = db;
  }

  // Récupère toutes les équipes avec pagination
  async getAllTeams(pagination: PaginationParams): Promise<DataResponse<Team[]>> {
    try {
      const { skip, take } = pagination;

      const [teams, total] = await Promise.all([
        this.db.team.findMany({
          skip,
          take,
          orderBy: { name: "asc" },
        }),
        this.db.team.count(),
      ]);

      return { data: teams, meta: { ...pagination, total } };
    } catch (error) {
      throw new AppError("Erreur lors de la récupération des équipes", 500, "DATABASE_ERROR");
    }
  }

  // Récupère une équipe par son ID
  async getTeamById(id: number): Promise<Team | null> {
    try {
      const team = await this.db.team.findUnique({
        where: { id },
      });
      return team;
    } catch (error) {
      throw new AppError("Erreur lors de la récupération de l'équipe", 500, "DATABASE_ERROR");
    }
  }

  // Crée une nouvelle équipe
  async createTeam(name: string, description?: string): Promise<Team> {
    try {
      const existingTeam = await this.db.team.findFirst({ where: { name } });
      if (existingTeam?.id) {
        throw new AppError("Une équipe avec ce nom existe déjà", 400, "TEAM_NAME_EXISTS");
      }

      const team = await this.db.team.create({
        data: { name, description },
      });
      return team;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("Erreur lors de la création de l'équipe", 500, "DATABASE_ERROR");
    }
  }

  // Met à jour une équipe existante
  async updateTeam(id: number, name?: string, description?: string): Promise<Team | null> {
    try {
      const existingTeam = await this.db.team.findUnique({ where: { id } });
      if (!existingTeam) {
        throw new AppError("Équipe non trouvée", 404, "TEAM_NOT_FOUND");
      }

      if (name && name !== existingTeam.name) {
        const nameExists = await this.db.team.findFirst({ where: { name } });
        if (nameExists && nameExists.id !== id) {
          throw new AppError("Une autre équipe avec ce nom existe déjà", 400, "TEAM_NAME_EXISTS");
        }
      }

      const team = await this.db.team.update({
        where: { id },
        data: { name, description },
      });
      return team;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("Erreur lors de la mise à jour de l'équipe", 500, "DATABASE_ERROR");
    }
  }

  // Supprime une équipe par son ID et réaffecte les utilisateurs à "Unassigned"
  async deleteTeam(id: number): Promise<boolean> {
    try {
      const team = await this.db.team.findUnique({ where: { id } });
      if (!team) {
        throw new AppError("Équipe non trouvée", 404, "TEAM_NOT_FOUND");
      }

      // Vérifier si une équipe "Unassigned" existe, sinon la créer
      let unassignedTeam = await this.db.team.findFirst({ where: { name: "Unassigned" } });
      if (!unassignedTeam) {
        unassignedTeam = await this.db.team.create({
          data: { name: "Unassigned", description: "Équipe par défaut pour les utilisateurs sans équipe" },
        });
      }

      // Réaffecter les utilisateurs à l'équipe "Unassigned"
      await this.db.user.updateMany({
        where: { teamId: id },
        data: { teamId: unassignedTeam.id },
      });

      // Supprimer l'équipe
      await this.db.team.delete({ where: { id } });
      return true;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("Erreur lors de la suppression de l'équipe", 500, "DATABASE_ERROR");
    }
  }
}

export default new TeamService();
