import { PrismaClient, Activity, ActivityType } from "@prisma/client";
import db from "../lib/db";
import { AppError } from "../middlewares/error.middleware";
import { PaginationParams } from "../utils/pagination";
import { DataResponse } from "../types";
import formatDateFr from "../utils/formatDateFr";

class ActivityService {
  private db: PrismaClient;

  constructor() {
    this.db = db;
  }

  async createActivity(userId: number, dateString: string, type: ActivityType, distanceKm: number, steps?: number) {
    // Parser la date (DD/MM/YYYY → Date)
    const [day, month, year] = dateString.split("/").map(Number);
    const activityDate = new Date(year, month - 1, day);

    // Comparer avec aujourd’hui (format fr)
    const todayFr = formatDateFr(new Date());
    const activityDateFr = formatDateFr(activityDate);

    if (activityDateFr !== todayFr) {
      throw new AppError("La date de l'activité doit être aujourd'hui uniquement.", 400);
    }

    // Vérifie unicité par (userId + date)
    const existing = await this.db.activity.findUnique({
      where: {
        userId_date: {
          userId,
          date: activityDate,
        },
      },
    });

    if (existing) {
      throw new AppError("Une activité a déjà été déclarée aujourd’hui.", 409);
    }

    // Validation selon type
    if (type === "MARCHE") {
      if (!steps || steps <= 0) {
        throw new AppError("Le nombre de pas est requis pour une activité MARCHE.", 400);
      }
      // Calcul distance à partir des pas (1500 pas = 1 km)
      distanceKm = parseFloat((steps / 1500).toFixed(1));
    }

    return this.db.activity.create({
      data: {
        userId,
        date: activityDate,
        type,
        steps: type === "MARCHE" ? steps : null,
        distanceKm,
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

    // Exécutez les deux requêtes en parallèle pour plus d'efficacité
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
