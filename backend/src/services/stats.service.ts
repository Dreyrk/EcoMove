import { PrismaClient } from "@prisma/client";
import db from "../lib/db";
import { PaginationParams } from "../utils/pagination";

class StatsService {
  private db: PrismaClient;

  constructor() {
    this.db = db;
  }

  async getGeneralStats() {
    const totalKm = await this.db.activity.aggregate({
      _sum: { distanceKm: true },
    });

    const totalUsers = await this.db.user.count();
    const totalTeams = await this.db.team.count();

    return {
      totalDistance: totalKm._sum.distanceKm || 0,
      totalParticipants: totalUsers,
      totalTeams: totalTeams,
      averageDistancePerParticipant: totalUsers > 0 ? (totalKm._sum.distanceKm || 0) / totalUsers : 0,
    };
  }

  async getTeamRankings() {
    const teams = await this.db.team.findMany({
      include: { users: { include: { activities: true } } },
    });

    let teamStats = teams.map((team) => {
      const totalKm = team.users.reduce(
        (sum, user) => sum + user.activities.reduce((actSum, act) => actSum + act.distanceKm, 0),
        0
      );
      const members = team.users.length;
      const avgPerUser = members > 0 ? totalKm / members : 0;

      return {
        name: team.name,
        totalKm: parseFloat(totalKm.toFixed(1)),
        members: members,
        avgPerUser: parseFloat(avgPerUser.toFixed(1)),
      };
    });

    // Trier et ajouter le rang et le badge
    const rankedTeams = teamStats
      .sort((a, b) => b.totalKm - a.totalKm)
      .map((team, index) => {
        const rank = index + 1;
        let badge = null;
        if (rank === 1) badge = "gold";
        if (rank === 2) badge = "silver";
        if (rank === 3) badge = "bronze";
        return { rank, ...team, badge };
      });

    return rankedTeams;
  }

  async getIndividualRankings() {
    const users = await this.db.user.findMany({
      include: {
        team: true,
        activities: { select: { distanceKm: true, date: true } },
      },
    });

    let userStats = users.map((user) => {
      const totalKm = user.activities.reduce((sum, act) => sum + act.distanceKm, 0);
      const uniqueDays = new Set(user.activities.map((act) => act.date.toISOString().split("T")[0])).size;
      const avgDaily = uniqueDays > 0 ? totalKm / uniqueDays : 0;

      return {
        name: user.name,
        team: user.team.name,
        totalKm: parseFloat(totalKm.toFixed(1)),
        avgDaily: parseFloat(avgDaily.toFixed(1)),
      };
    });

    // Trier, prendre le top 10, et ajouter le rang/badge
    const rankedUsers = userStats
      .sort((a, b) => b.totalKm - a.totalKm)
      .slice(0, 10)
      .map((user, index) => {
        const rank = index + 1;
        let badge = null;
        if (rank === 1) badge = "gold";
        if (rank === 2) badge = "silver";
        if (rank === 3) badge = "bronze";
        return { rank, ...user, badge };
      });

    return rankedUsers;
  }

  async getUserStats(userId: number) {
    const today = new Date();
    const last30Days = new Date();
    last30Days.setDate(today.getDate() - 30);

    // 1. Récupérer toutes les activités de l'utilisateur
    const activities = await this.db.activity.findMany({
      where: {
        userId,
        date: {
          gte: last30Days,
          lte: today,
        },
      },
    });

    const totalKm = activities.reduce((acc, a) => acc + a.distanceKm, 0);
    const bikeKm = activities.filter((a) => a.type === "VELO").reduce((acc, a) => acc + a.distanceKm, 0);
    const walkKm = totalKm - bikeKm;

    // 2. Moyenne quotidienne
    const uniqueDays = new Set(activities.map((a) => a.date.toDateString())).size;
    const dailyAverage = uniqueDays > 0 ? totalKm / uniqueDays : 0;

    // 3. Classement individuel
    const allUsers = await this.db.user.findMany({
      include: {
        activities: true,
      },
    });

    const userTotals = allUsers.map((u) => ({
      userId: u.id,
      totalKm: u.activities.reduce((acc, a) => acc + a.distanceKm, 0),
    }));

    const sortedByKm = userTotals.sort((a, b) => b.totalKm - a.totalKm);
    const individualRank = sortedByKm.findIndex((u) => u.userId === userId) + 1;

    // 4. Classement équipe
    const user = await this.db.user.findUnique({ where: { id: userId } });
    const teamId = user?.teamId;

    const allTeams = await this.db.team.findMany({
      include: {
        users: {
          include: { activities: true },
        },
      },
    });

    const teamTotals = allTeams.map((team) => ({
      teamId: team.id,
      totalKm: team.users.reduce((acc, user) => acc + user.activities.reduce((sum, a) => sum + a.distanceKm, 0), 0),
    }));

    const sortedTeams = teamTotals.sort((a, b) => b.totalKm - a.totalKm);
    const teamRank = sortedTeams.findIndex((t) => t.teamId === teamId) + 1;

    // 5. Autres stats
    const totalUsers = await this.db.user.count();
    const totalTeams = await this.db.team.count();

    // 6. Jours actifs
    const daysActive = uniqueDays;

    // 7. Streak (jours consécutifs)
    const activityDates = activities
      .map((a) => a.date.toDateString())
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    let streak = 0;
    let currentDate = new Date();

    for (let i = 0; i < activityDates.length; i++) {
      if (new Date(activityDates[i]).toDateString() === currentDate.toDateString()) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return {
      totalKm: parseFloat(totalKm.toFixed(1)),
      bikeKm: parseFloat(bikeKm.toFixed(1)),
      walkKm: parseFloat(walkKm.toFixed(1)),
      dailyAverage: parseFloat(dailyAverage.toFixed(1)),
      individualRank,
      teamRank,
      totalUsers,
      totalTeams,
      daysActive,
      streak,
    };
  }

  async getUserProgress(userId: number, pagination: PaginationParams) {
    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - 29); // 30 jours glissants

    const activities = await this.db.activity.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: today,
        },
      },
    });

    // Initialiser toutes les dates avec 0
    const progressMap: Record<string, { bike: number; walk: number }> = {};

    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const key = d.toISOString().split("T")[0];
      progressMap[key] = { bike: 0, walk: 0 };
    }

    for (const act of activities) {
      const key = act.date.toISOString().split("T")[0];
      if (!progressMap[key]) progressMap[key] = { bike: 0, walk: 0 };

      if (act.type === "VELO") {
        progressMap[key].bike += act.distanceKm;
      } else {
        progressMap[key].walk += act.distanceKm;
      }
    }

    const allEntries = Object.entries(progressMap)
      .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
      .map(([date, { bike, walk }]) => ({
        date,
        bike: +bike.toFixed(1),
        walk: +walk.toFixed(1),
      }));

    const total = allEntries.length;
    const { skip, take, page, per_page } = pagination;
    const paginatedData = allEntries.slice(skip, skip + take);

    return {
      data: paginatedData,
      meta: {
        total,
        page,
        per_page,
        skip,
        take,
      },
    };
  }
}

export default new StatsService();
