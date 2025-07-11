import { PrismaClient, Activity } from "@prisma/client";
import db from "../lib/db";

class ActivityService {
  private db: PrismaClient;

  constructor() {
    this.db = db;
  }

  // Create a new activity
  async createActivity(
    userId: number,
    date: Date,
    type: "VELO" | "MARCHE",
    steps: number,
    distanceKm: number
  ): Promise<Activity> {
    if (type === "MARCHE") {
      distanceKm = steps / 1500;
    }

    return this.db.activity.create({
      data: {
        userId,
        date,
        type,
        steps,
        distanceKm,
      },
    });
  }

  // Get all activities
  async getAllActivities(): Promise<Activity[]> {
    return this.db.activity.findMany();
  }

  // Get activity by ID
  async getActivityById(id: number): Promise<Activity | null> {
    return this.db.activity.findUnique({
      where: { id },
    });
  }

  // Get activities by user ID
  async getActivitiesByUserId(userId: number): Promise<Activity[]> {
    return this.db.activity.findMany({
      where: { userId },
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

  // Delete an activity
  async deleteActivity(id: number): Promise<Activity> {
    return this.db.activity.delete({
      where: { id },
    });
  }
}

export default new ActivityService();
