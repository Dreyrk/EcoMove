import { PrismaClient, UserRoleType } from "@prisma/client";
import { z } from "zod";
import db from "../lib/db";
import { UserSchema } from "../schemas/user.schema";
import { formatZodErrors } from "../utils/formatZodErrors";
import { AppError } from "../middlewares/error.middleware";

export interface UserWithoutPassword {
  id: number;
  name: string;
  email: string;
  role: UserRoleType;
  teamId: number | null;
  createdAt?: string;
  team?: {
    id: number;
    name: string;
  };
}

export interface SelectedUser {
  id: number;
  email: string;
  password: string;
  role: UserRoleType;
}

class UserService {
  private db: PrismaClient;

  constructor() {
    this.db = db;
  }

  // Crée un nouvel utilisateur avec validation
  async createUser(data: {
    name: string;
    email: string;
    password: string;
    teamId: number;
    role?: UserRoleType;
  }): Promise<UserWithoutPassword> {
    try {
      // Valider les données avec Zod
      const validatedUser = UserSchema.safeParse(data);
      if (!validatedUser.success) {
        throw new AppError(`Erreur de validation : ${formatZodErrors(validatedUser.error)}`, 400, "VALIDATION_ERROR");
      }

      // Vérifier si l'équipe existe
      const team = await this.db.team.findUnique({ where: { id: validatedUser.data.teamId } });
      if (!team) {
        throw new AppError("Équipe non trouvée", 404, "TEAM_NOT_FOUND");
      }

      // Vérifier si l'email est déjà utilisé
      const existingUser = await this.db.user.findUnique({ where: { email: validatedUser.data.email } });
      if (existingUser) {
        throw new AppError("Cet email est déjà utilisé", 400, "EMAIL_ALREADY_EXISTS");
      }

      // Créer l'utilisateur
      const createdUser = await this.db.user.create({
        data: validatedUser.data,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          teamId: true,
          createdAt: true,
        },
      });

      return {
        ...createdUser,
        createdAt: createdUser.createdAt.toISOString(),
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("Erreur lors de la création de l'utilisateur", 500, "DATABASE_ERROR");
    }
  }

  // Récupère un utilisateur par email pour la connexion
  async getUserByEmail(email: string): Promise<SelectedUser | null> {
    try {
      // Valider l'email
      if (!z.string().email().safeParse(email).success) {
        throw new AppError("Email invalide", 400, "INVALID_EMAIL");
      }

      return await this.db.user.findUnique({
        where: { email },
        select: { id: true, email: true, password: true, role: true },
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("Erreur lors de la récupération de l'utilisateur", 500, "DATABASE_ERROR");
    }
  }

  // Récupère un utilisateur par ID avec informations d'équipe
  async getUserById(id: number): Promise<UserWithoutPassword | null> {
    try {
      const user = await this.db.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          teamId: true,
          team: {
            select: { id: true, name: true },
          },
        },
      });

      if (!user) {
        return null;
      }

      return user;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("Erreur lors de la récupération de l'utilisateur", 500, "DATABASE_ERROR");
    }
  }
}

export default new UserService();
