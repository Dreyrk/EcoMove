import { PrismaClient, Activity, ActivityType } from "@prisma/client";
import db from "../lib/db";
import { AppError } from "../middlewares/error.middleware";
import { PaginationParams } from "../utils/pagination";
import { DataResponse } from "../types";

class ActivityService {
  private db: PrismaClient;

  constructor() {
    this.db = db;
  }

  // Créer une activité (déclaration quotidienne)
  async createActivity(
    userId: number,
    date: Date,
    type: ActivityType,
    steps?: number,
    distanceKm?: number
  ): Promise<Activity> {
    // Vérifie que la date n'est pas dans le futur
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (date > today) {
      throw new AppError("La date de l'activité ne peut pas être dans le futur.", 400);
    }

    // Vérifie si une activité pour ce userId + date existe déjà
    const existing = await this.db.activity.findUnique({
      where: {
        userId_date: { userId, date },
      },
    });

    if (existing) {
      throw new AppError("Une activité a déjà été déclarée pour cette date.", 409);
    }

    // Calcul auto si MARCHE
    let finalDistance = distanceKm ?? 0;
    if (type === "MARCHE") {
      if (!steps) {
        throw new AppError("Le nombre de pas est requis pour une activité MARCHE.", 400);
      }
      finalDistance = steps / 1500;
    }

    return this.db.activity.create({
      data: {
        userId,
        date,
        type,
        steps: steps ?? null,
        distanceKm: finalDistance,
      },
    });
  }

  // Liste paginée des activités
  async getAllActivities(paginationMeta: PaginationParams): Promise<DataResponse<Activity>> {
    const { skip, take, page, per_page } = paginationMeta;

    const [activities, total] = await Promise.all([
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
  }

  // Activités d'un utilisateur
  async getActivitiesByUserId(userId: number, paginationMeta: PaginationParams): Promise<DataResponse<Activity>> {
    const { skip, take, page, per_page } = paginationMeta;

    const activities = await this.db.activity.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      skip,
      take,
    });

    return {
      data: activities,
      meta: {
        skip,
        take,
        page,
        per_page,
        total: activities.length,
      },
    };
  }

  // Suppression (optionnel, à restreindre à l'admin)
  async deleteActivity(id: number): Promise<Activity> {
    return this.db.activity.delete({
      where: { id },
    });
  }

  // Update an activity
  async updateActivity(
    id: number,
    data: { steps?: number; distanceKm?: number; type?: "VELO" | "MARCHE"; date?: Date }
  ): Promise<Activity> {
    if (data.type === "MARCHE" && data.steps) {
      data.distanceKm = data.steps / 1500;
    }

    return this.db.activity.update({
      where: { id },
      data,
    });
  }
}

export default new ActivityService();
