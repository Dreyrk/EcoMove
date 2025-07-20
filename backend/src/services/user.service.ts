import { PrismaClient, UserRoleType } from "@prisma/client";
import { z } from "zod";
import db from "../lib/db";
import { UserSchema } from "../schemas/user.schema";
import { formatZodErrors } from "../utils/formatZodErrors";
import { AppError } from "../middlewares/error.middleware";
import { PaginationParams } from "../utils/pagination";
import { DataResponse } from "../types";

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

  // Récupère tous les utilisateurs avec leurs équipes
  async getAllUsers(pagination: PaginationParams): Promise<DataResponse<UserWithoutPassword[]>> {
    try {
      const { skip, take, page, per_page } = pagination;

      const [users, total] = await this.db.$transaction([
        this.db.user.findMany({
          skip: skip,
          take: take,
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            teamId: true,
            createdAt: true,
            team: {
              select: { id: true, name: true },
            },
          },
        }),
        this.db.user.count(), // Get the total count of users for pagination metadata
      ]);

      const formattedUsers = users.map((user) => ({
        ...user,
        createdAt: user.createdAt.toISOString(),
      }));

      return {
        data: formattedUsers,
        meta: {
          total,
          page,
          per_page,
          skip,
          take,
        },
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("Erreur lors de la récupération des utilisateurs", 500, "DATABASE_ERROR");
    }
  }

  // Met à jour un utilisateur
  async updateUser(
    id: number,
    data: { name?: string; email?: string; team?: { id: number }; role?: UserRoleType }
  ): Promise<UserWithoutPassword> {
    try {
      const UpdateUserSchema = z.object({
        name: z.string().min(1, "Le nom est requis").optional(),
        email: z.email("Email invalide").optional(),
        team: z
          .object({
            id: z.number().int().positive("L'ID de l'équipe doit être un entier positif"),
          })
          .optional(),
        role: z.enum(["USER", "ADMIN"]).optional(),
      });

      const validation = UpdateUserSchema.safeParse(data);
      if (!validation.success) {
        throw new AppError(`Erreur de validation : ${formatZodErrors(validation.error)}`, 400, "VALIDATION_ERROR");
      }

      const validData = validation.data;

      const existingUser = await this.db.user.findUnique({ where: { id } });
      if (!existingUser) {
        throw new AppError("Utilisateur non trouvé", 404, "USER_NOT_FOUND");
      }

      if (validData.email && validData.email !== existingUser.email) {
        const emailExists = await this.db.user.findUnique({ where: { email: validData.email } });
        if (emailExists) {
          throw new AppError("Cet email est déjà utilisé", 400, "EMAIL_ALREADY_EXISTS");
        }
      }

      let teamId: number | undefined;
      if (validData.team) {
        teamId = validData.team.id;
        const team = await this.db.team.findUnique({ where: { id: teamId } });
        if (!team) {
          throw new AppError("Équipe non trouvée", 404, "TEAM_NOT_FOUND");
        }
      }

      const updatedUser = await this.db.user.update({
        where: { id },
        data: {
          name: validData.name,
          email: validData.email,
          role: validData.role,
          teamId: teamId,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          teamId: true,
          createdAt: true,
          team: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return {
        ...updatedUser,
        createdAt: updatedUser.createdAt.toISOString(),
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("Erreur lors de la mise à jour de l'utilisateur", 500, "DATABASE_ERROR");
    }
  }

  // Supprime un utilisateur
  async deleteUser(id: number): Promise<void> {
    try {
      // Vérifier si l'utilisateur existe
      const existingUser = await this.db.user.findUnique({ where: { id } });
      if (!existingUser) {
        throw new AppError("Utilisateur non trouvé", 404, "USER_NOT_FOUND");
      }

      // Supprimer les activités associées à l'utilisateur
      await this.db.activity.deleteMany({
        where: { userId: id },
      });

      // Supprimer l'utilisateur
      await this.db.user.delete({ where: { id } });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("Erreur lors de la suppression de l'utilisateur", 500, "DATABASE_ERROR");
    }
  }
}

export default new UserService();
