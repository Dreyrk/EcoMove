import { PrismaClient, Activity, ActivityType } from "@prisma/client";
import db from "../lib/db";

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
      throw new Error("La date de l'activité ne peut pas être dans le futur.");
    }

    // Vérifie si une activité pour ce userId + date existe déjà
    const existing = await this.db.activity.findUnique({
      where: {
        userId_date: { userId, date },
      },
    });

    if (existing) {
      throw new Error("Une activité a déjà été déclarée pour cette date.");
    }

    // Calcul auto si MARCHE
    let finalDistance = distanceKm ?? 0;
    if (type === "MARCHE") {
      if (!steps) {
        throw new Error("Le nombre de pas est requis pour une activité MARCHE.");
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
  async getAllActivities(skip: number, take: number, page: number, perPage: number) {
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
      status: "success",
      data: activities,
      meta: {
        total,
        page,
        per_page: perPage,
      },
    };
  }

  // Activités d'un utilisateur
  async getActivitiesByUserId(userId: number): Promise<Activity[]> {
    return this.db.activity.findMany({
      where: { userId },
      orderBy: { date: "desc" },
    });
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
