import { PrismaClient } from "@prisma/client";
import db from "../lib/db";

class StatsService {
  private db: PrismaClient;

  constructor() {
    this.db = db;
  }

  async getGeneralStats() {
    const totalDistance = await db.activity.aggregate({
      _sum: { distanceKm: true },
    });

    const totalActivities = await db.activity.count();

    const totalUsers = await db.user.count();

    return {
      totalDistanceKm: totalDistance._sum.distanceKm || 0,
      totalActivities,
      totalUsers,
    };
  }

  async getTeamStats() {
    const teams = await db.team.findMany({
      include: {
        users: {
          include: {
            activities: true,
          },
        },
      },
    });

    return teams.map((team) => {
      const allActivities = team.users.flatMap((user) => user.activities);
      const totalKm = allActivities.reduce((sum, a) => sum + a.distanceKm, 0);
      const avgPerUser = team.users.length > 0 ? totalKm / team.users.length : 0;

      return {
        teamId: team.id,
        teamName: team.name,
        totalDistanceKm: totalKm,
        averagePerUserKm: avgPerUser,
      };
    });
  }

  async getUserStats() {
    const users = await db.user.findMany({
      include: {
        activities: true,
      },
    });

    return users
      .map((user) => {
        const totalKm = user.activities.reduce((sum, a) => sum + a.distanceKm, 0);
        return {
          userId: user.id,
          userName: user.name,
          totalDistanceKm: totalKm,
        };
      })
      .sort((a, b) => b.totalDistanceKm - a.totalDistanceKm);
  }
}

export default new StatsService();
