import { PrismaClient, Activity, ActivityType } from "@prisma/client";
import db from "../lib/db";
import { AppError } from "../middlewares/error.middleware";
import { PaginationParams } from "../utils/pagination";
import formatDateFr from "../utils/formatDateFr";
import { DataResponse } from "../types";

class ActivityService {
  private db: PrismaClient;

  constructor() {
    this.db = db;
  }

  // Crée une nouvelle activité avec validation
  async createActivity(
    userId: number,
    dateString: string,
    type: ActivityType,
    distanceKm: number,
    steps?: number
  ): Promise<Activity> {
    try {
      // Valider userId

      // Vérifier l'existence de l'utilisateur
      const user = await this.db.user.findUnique({ where: { id: userId } });
      if (!user) {
        throw new AppError("Utilisateur non trouvé", 404, "USER_NOT_FOUND");
      }

      // Parser et valider la date (DD/MM/YYYY)
      const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
      if (!dateRegex.test(dateString)) {
        throw new AppError("Format de date invalide (DD/MM/YYYY)", 400, "INVALID_DATE");
      }
      const [day, month, year] = dateString.split("/").map(Number);
      const activityDate = new Date(year, month - 1, day);
      if (isNaN(activityDate.getTime())) {
        throw new AppError("Date invalide", 400, "INVALID_DATE");
      }

      // Vérifier que la date est aujourd'hui
      const todayFr = formatDateFr(new Date());
      const activityDateFr = formatDateFr(activityDate);
      if (activityDateFr !== todayFr) {
        throw new AppError("La date de l'activité doit être aujourd'hui uniquement", 400, "INVALID_DATE");
      }

      // Vérifier l'unicité (userId + date)
      const existing = await this.db.activity.findUnique({
        where: {
          userId_date: {
            userId,
            date: activityDate,
          },
        },
      });
      if (existing) {
        throw new AppError("Une activité a déjà été déclarée aujourd'hui", 409, "ACTIVITY_ALREADY_EXISTS");
      }

      // Valider selon le type
      let finalDistanceKm = distanceKm;
      if (type === "MARCHE") {
        if (!steps || steps <= 0) {
          throw new AppError("Le nombre de pas est requis pour une activité MARCHE", 400, "INVALID_STEPS");
        }
        finalDistanceKm = parseFloat((steps / 1500).toFixed(1));
      }

      const activity = await this.db.activity.create({
        data: {
          userId,
          date: activityDate,
          type,
          steps: type === "MARCHE" ? steps : null,
          distanceKm: finalDistanceKm,
        },
        include: {
          user: {
            select: { id: true, name: true, teamId: true },
          },
        },
      });

      return activity;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("Erreur lors de la création de l'activité", 500, "DATABASE_ERROR");
    }
  }

  // Récupère toutes les activités avec pagination
  async getAllActivities(paginationMeta: PaginationParams): Promise<DataResponse<Activity[]>> {
    try {
      const { skip, take, page, per_page } = paginationMeta;

      const [activities, total] = await this.db.$transaction([
        this.db.activity.findMany({
          skip,
          take,
          orderBy: { date: "desc" },
          include: {
            user: {
              select: { id: true, name: true, teamId: true },
            },
          },
        }),
        this.db.activity.count(),
      ]);

      return {
        data: activities,
        meta: {
          total,
          skip,
          take,
          page,
          per_page,
        },
      };
    } catch (error) {
      throw new AppError("Erreur lors de la récupération des activités", 500, "DATABASE_ERROR");
    }
  }

  // Récupère les activités d'un utilisateur avec pagination
  async getActivitiesByUserId(userId: number, paginationMeta: PaginationParams): Promise<DataResponse<Activity[]>> {
    try {
      // Valider userId

      const { skip, take, page, per_page } = paginationMeta;

      const [activities, total] = await this.db.$transaction([
        this.db.activity.findMany({
          where: { userId },
          orderBy: { date: "desc" },
          skip,
          take,
        }),
        this.db.activity.count({
          where: { userId },
        }),
      ]);

      return {
        data: activities,
        meta: {
          skip,
          take,
          page,
          per_page,
          total,
        },
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("Erreur lors de la récupération des activités", 500, "DATABASE_ERROR");
    }
  }

  // Récupère une activité par ID (utilisé pour les vérifications)
  async getActivityById(id: number): Promise<Activity | null> {
    try {
      const activity = await this.db.activity.findUnique({
        where: { id },
        include: {
          user: {
            select: { id: true, name: true, teamId: true },
          },
        },
      });

      if (!activity) {
        return null;
      }

      return activity;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("Erreur lors de la récupération de l'activité", 500, "DATABASE_ERROR");
    }
  }

  // Met à jour une activité existante
  async updateActivity(
    id: number,
    data: {
      user?: { id: number };
      dateString?: string;
      type?: ActivityType;
      distanceKm?: number;
      steps?: number;
    }
  ): Promise<Activity> {
    try {
      // Valider l'ID
      if (!Number.isInteger(id) || id <= 0) {
        throw new AppError("L'ID de l'activité doit être un entier positif", 400, "INVALID_ID");
      }

      // Vérifier si l'activité existe
      const existingActivity = await this.db.activity.findUnique({ where: { id } });
      if (!existingActivity) {
        throw new AppError("Activité non trouvée", 404, "ACTIVITY_NOT_FOUND");
      }

      // Vérifier l'utilisateur si userId est modifié
      let userName = existingActivity.userId
        ? (await this.db.user.findUnique({ where: { id: existingActivity.userId } }))?.name
        : "";
      if (data.user?.id && data.user.id !== existingActivity.userId) {
        const user = await this.db.user.findUnique({
          where: { id: data.user.id },
          select: { id: true, name: true, teamId: true },
        });
        if (!user) {
          throw new AppError("Utilisateur non trouvé", 404, "USER_NOT_FOUND");
        }
        userName = user.name;
      }

      // Valider et parser la date si fournie
      let activityDate: Date | undefined;
      if (data.dateString) {
        const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
        if (!dateRegex.test(data.dateString)) {
          throw new AppError("Format de date invalide (DD/MM/YYYY)", 400, "INVALID_DATE");
        }
        const [day, month, year] = data.dateString.split("/").map(Number);
        activityDate = new Date(year, month - 1, day);
        if (isNaN(activityDate.getTime())) {
          throw new AppError("Date invalide", 400, "INVALID_DATE");
        }

        // Vérifier que la date est aujourd'hui
        const todayFr = formatDateFr(new Date());
        const activityDateFr = formatDateFr(activityDate);
        if (activityDateFr !== todayFr) {
          throw new AppError("La date de l'activité doit être aujourd'hui uniquement", 400, "INVALID_DATE");
        }
      }

      // Vérifier l'unicité (userId + date) si userId ou date sont modifiés
      if ((data.user?.id && data.user.id !== existingActivity.userId) || data.dateString) {
        const checkUserId = data.user?.id || existingActivity.userId;
        const checkDate = activityDate || existingActivity.date;
        const existing = await this.db.activity.findUnique({
          where: {
            userId_date: {
              userId: checkUserId,
              date: checkDate,
            },
          },
        });
        if (existing && existing.id !== id) {
          throw new AppError(
            "Une activité existe déjà pour cet utilisateur à cette date",
            409,
            "ACTIVITY_ALREADY_EXISTS"
          );
        }
      }

      // Valider selon le type si modifié
      let finalDistanceKm = data.distanceKm !== undefined ? data.distanceKm : existingActivity.distanceKm;
      if (data.type === "MARCHE" || (data.type === undefined && existingActivity.type === "MARCHE")) {
        if (data.steps === undefined && data.type === "MARCHE") {
          throw new AppError("Le nombre de pas est requis pour une activité MARCHE", 400, "INVALID_STEPS");
        }
        if (data.steps !== undefined && data.steps <= 0) {
          throw new AppError("Le nombre de pas doit être positif", 400, "INVALID_STEPS");
        }
        if (data.steps !== undefined) {
          finalDistanceKm = parseFloat((data.steps / 1500).toFixed(1));
        }
      }

      const activity = await this.db.activity.update({
        where: { id },
        data: {
          userId: data.user?.id,
          date: activityDate,
          type: data.type,
          distanceKm: finalDistanceKm,
          steps:
            data.type === "MARCHE" || (data.type === undefined && existingActivity.type === "MARCHE")
              ? data.steps
              : null,
        },
        include: {
          user: {
            select: { id: true, name: true, teamId: true },
          },
        },
      });

      return activity;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("Erreur lors de la mise à jour de l'activité", 500, "DATABASE_ERROR");
    }
  }

  // Supprime une activité par ID
  async deleteActivity(id: number): Promise<void> {
    try {
      const activity = await this.db.activity.findUnique({ where: { id } });
      if (!activity) {
        throw new AppError("Activité non trouvée", 404, "ACTIVITY_NOT_FOUND");
      }

      await this.db.activity.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("Erreur lors de la suppression de l'activité", 500, "DATABASE_ERROR");
    }
  }
}

export default new ActivityService();
