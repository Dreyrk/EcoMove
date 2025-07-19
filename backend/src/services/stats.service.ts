// Importation des dépendances nécessaires
import { PrismaClient, ActivityType } from "@prisma/client";
import db from "../lib/db";
import { PaginationParams } from "../utils/pagination";
import { AppError } from "../middlewares/error.middleware";
import { DataResponse } from "../types";

// Interface pour les statistiques d’équipe
interface TeamRanking {
  rank: number;
  name: string;
  totalKm: number;
  members: number;
  avgPerUser: number;
  badge: string | null;
}

// Interface pour les statistiques utilisateur
interface UserRanking {
  rank: number;
  name: string;
  team: string;
  totalKm: number;
  avgDaily: number;
  badge: string | null;
}

class StatsService {
  private db: PrismaClient;

  constructor() {
    this.db = db;
  }

  // Récupère les statistiques globales du challenge
  async getGeneralStats() {
    try {
      // Total des participants
      const totalParticipants = await this.db.user.count();

      // Total des équipes
      const totalTeams = await this.db.team.count();

      // Récupérer toutes les activités
      const activities = await this.db.activity.findMany({
        select: { distanceKm: true, type: true, date: true },
      });

      if (activities.length === 0) {
        return {
          totalParticipants,
          totalDistance: 0,
          totalTeams,
          avgDailyDistance: 0,
          topActivityType: null,
          challengeDuration: 0,
          activeDays: 0,
          co2Saved: 0,
        };
      }

      // Calculer la distance totale
      const totalDistance = activities.reduce((sum, activity) => sum + activity.distanceKm, 0);

      // Calculer le type d’activité le plus populaire
      const activityTypeCount = activities.reduce((acc, activity) => {
        acc[activity.type] = (acc[activity.type] || 0) + 1;
        return acc;
      }, {} as Record<ActivityType, number>);

      const topActivityType = Object.entries(activityTypeCount).reduce((a, b) =>
        activityTypeCount[a[0] as ActivityType] > activityTypeCount[b[0] as ActivityType] ? a : b
      )[0] as ActivityType;

      // Calculer la durée du challenge
      const dates = activities.map((activity) => activity.date);
      const oldestDate = new Date(Math.min(...dates.map((date) => date.getTime())));
      const newestDate = new Date(Math.max(...dates.map((date) => date.getTime())));
      const challengeDuration = Math.ceil((newestDate.getTime() - oldestDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

      // Calculer les jours actifs
      const uniqueDates = new Set(activities.map((activity) => activity.date.toDateString()));
      const activeDays = uniqueDates.size;

      // Calculer la distance moyenne par jour
      const avgDailyDistance = activeDays > 0 ? totalDistance / activeDays : 0;

      // Calculer le CO2 économisé (0.21 kg/km pour vélo, 0.19 kg/km pour marche)
      const co2Saved = activities.reduce((sum, activity) => {
        const factor = activity.type === "VELO" ? 0.21 : 0.19;
        return sum + activity.distanceKm * factor;
      }, 0);

      return {
        totalParticipants,
        totalDistance: Math.round(totalDistance * 10) / 10,
        totalTeams,
        avgDailyDistance: Math.round(avgDailyDistance * 10) / 10,
        topActivityType,
        challengeDuration,
        activeDays,
        co2Saved: Math.round(co2Saved * 10) / 10,
      };
    } catch (error) {
      throw new AppError("Erreur lors de la récupération des statistiques globales", 500, "DATABASE_ERROR");
    }
  }

  // Récupère le classement des équipes avec pagination
  async getTeamRankings(pagination: PaginationParams, topOnly?: boolean): Promise<DataResponse<TeamRanking[]>> {
    try {
      const { skip, take, page, per_page } = pagination;

      // Récupérer toutes les équipes avec leurs utilisateurs et activités
      const teams = await this.db.team.findMany({
        include: { users: { include: { activities: { select: { distanceKm: true } } } } },
      });

      // Calculer les statistiques par équipe
      const teamStats = teams.map((team) => {
        const totalKm = team.users.reduce(
          (sum, user) => sum + user.activities.reduce((actSum, act) => actSum + act.distanceKm, 0),
          0
        );
        const members = team.users.length;
        const avgPerUser = members > 0 ? totalKm / members : 0;

        return {
          name: team.name,
          totalKm: Math.round(totalKm * 10) / 10,
          members,
          avgPerUser: Math.round(avgPerUser * 10) / 10,
        };
      });

      // Trier et ajouter le rang et le badge
      let rankedTeams = teamStats
        .sort((a, b) => b.totalKm - a.totalKm)
        .map((team, index) => {
          const rank = index + 1;
          let badge = null;
          if (rank === 1) badge = "gold";
          if (rank === 2) badge = "silver";
          if (rank === 3) badge = "bronze";
          return { rank, ...team, badge };
        });

      // Si topOnly est activé, ne garder que les 10 premiers du classement
      if (topOnly) {
        rankedTeams = rankedTeams.slice(0, 10);
      }

      // Appliquer la pagination
      const total = rankedTeams.length;
      const paginatedData = rankedTeams.slice(skip, skip + take);

      return {
        data: paginatedData,
        meta: { total, page, per_page, skip, take },
      };
    } catch (error) {
      throw new AppError("Erreur lors de la récupération du classement des équipes", 500, "DATABASE_ERROR");
    }
  }

  // Récupère le classement individuel des utilisateurs avec pagination
  async getIndividualRankings(pagination: PaginationParams, topOnly?: boolean): Promise<DataResponse<UserRanking[]>> {
    try {
      const { skip, take, page, per_page } = pagination;

      // Récupérer tous les utilisateurs avec leurs activités et équipe
      const users = await this.db.user.findMany({
        include: {
          team: { select: { name: true } },
          activities: { select: { distanceKm: true, date: true } },
        },
      });

      // Calculer les statistiques par utilisateur
      const userStats = users.map((user) => {
        const totalKm = user.activities.reduce((sum, act) => sum + act.distanceKm, 0);
        const uniqueDays = new Set(user.activities.map((act) => act.date.toISOString().split("T")[0])).size;
        const avgDaily = uniqueDays > 0 ? totalKm / uniqueDays : 0;

        return {
          name: user.name,
          team: user.team?.name || "Sans équipe",
          totalKm: Math.round(totalKm * 10) / 10,
          avgDaily: Math.round(avgDaily * 10) / 10,
        };
      });

      // Trier et ajouter le rang et le badge
      let rankedUsers = userStats
        .sort((a, b) => b.totalKm - a.totalKm)
        .map((user, index) => {
          const rank = index + 1;
          let badge = null;
          if (rank === 1) badge = "gold";
          if (rank === 2) badge = "silver";
          if (rank === 3) badge = "bronze";
          return { rank, ...user, badge };
        });

      // Si topOnly est activé, ne garder que les 10 premiers
      if (topOnly) {
        rankedUsers = rankedUsers.slice(0, 10);
      }

      // Appliquer la pagination
      const total = rankedUsers.length;
      const paginatedData = rankedUsers.slice(skip, skip + take);

      return {
        data: paginatedData,
        meta: { total, page, per_page, skip, take },
      };
    } catch (error) {
      throw new AppError("Erreur lors de la récupération du classement individuel", 500, "DATABASE_ERROR");
    }
  }

  // Récupère les statistiques d’un utilisateur spécifique
  async getUserStats(userId: number) {
    try {
      if (userId <= 0) {
        throw new AppError("L'ID doit être un entier positif", 400, "INVALID_ID");
      }

      // Vérifier si l’utilisateur existe
      const user = await this.db.user.findUnique({ where: { id: userId } });
      if (!user) {
        throw new AppError("Utilisateur non trouvé", 404, "USER_NOT_FOUND");
      }

      // Récupérer les activités des 30 derniers jours
      const today = new Date();
      const last30Days = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

      const activities = await this.db.activity.findMany({
        where: {
          userId,
          date: { gte: last30Days, lte: today },
        },
        select: { distanceKm: true, type: true, date: true },
      });

      // Calculer les distances totales
      const totalKm = activities.reduce((acc, a) => acc + a.distanceKm, 0);
      const bikeKm = activities.filter((a) => a.type === "VELO").reduce((acc, a) => acc + a.distanceKm, 0);
      const walkKm = totalKm - bikeKm;

      // Calculer la moyenne quotidienne
      const uniqueDays = new Set(activities.map((a) => a.date.toDateString())).size;
      const dailyAverage = uniqueDays > 0 ? totalKm / uniqueDays : 0;

      // Calculer le classement individuel
      const allUsers = await this.db.user.findMany({
        include: { activities: { select: { distanceKm: true } } },
      });

      const userTotals = allUsers.map((u) => ({
        userId: u.id,
        totalKm: u.activities.reduce((acc, a) => acc + a.distanceKm, 0),
      }));

      const sortedByKm = userTotals.sort((a, b) => b.totalKm - a.totalKm);
      const individualRank = sortedByKm.findIndex((u) => u.userId === userId) + 1;

      // Calculer le classement de l’équipe
      const teamId = user.teamId;
      let teamRank = 0;
      if (teamId) {
        const allTeams = await this.db.team.findMany({
          include: { users: { include: { activities: { select: { distanceKm: true } } } } },
        });

        const teamTotals = allTeams.map((team) => ({
          teamId: team.id,
          totalKm: team.users.reduce((acc, user) => acc + user.activities.reduce((sum, a) => sum + a.distanceKm, 0), 0),
        }));

        const sortedTeams = teamTotals.sort((a, b) => b.totalKm - a.totalKm);
        teamRank = sortedTeams.findIndex((t) => t.teamId === teamId) + 1;
      }

      // Autres statistiques
      const totalUsers = await this.db.user.count();
      const totalTeams = await this.db.team.count();
      const daysActive = uniqueDays;

      // Calculer le streak (jours consécutifs avec activité)
      const activityDates = activities
        .map((a) => a.date.toDateString())
        .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

      let streak = 0;
      let currentDate = new Date();

      for (const date of activityDates) {
        if (new Date(date).toDateString() === currentDate.toDateString()) {
          streak++;
          currentDate.setDate(currentDate.getDate() - 1);
        } else {
          break;
        }
      }

      return {
        totalKm: Math.round(totalKm * 10) / 10,
        bikeKm: Math.round(bikeKm * 10) / 10,
        walkKm: Math.round(walkKm * 10) / 10,
        dailyAverage: Math.round(dailyAverage * 10) / 10,
        individualRank,
        teamRank,
        totalUsers,
        totalTeams,
        daysActive,
        streak,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("Erreur lors de la récupération des statistiques utilisateur", 500, "DATABASE_ERROR");
    }
  }

  // Récupère la progression quotidienne d’un utilisateur avec pagination
  async getUserProgress(
    userId: number,
    pagination: PaginationParams
  ): Promise<DataResponse<{ date: string; bike: number; walk: number }[]>> {
    try {
      if (userId <= 0) {
        throw new AppError("L'ID doit être un entier positif", 400, "INVALID_ID");
      }

      // Vérifier si l’utilisateur existe
      const user = await this.db.user.findUnique({ where: { id: userId } });
      if (!user) {
        throw new AppError("Utilisateur non trouvé", 404, "USER_NOT_FOUND");
      }

      // Récupérer les activités des 30 derniers jours
      const today = new Date();
      const startDate = new Date(today.getTime() - 29 * 24 * 60 * 60 * 1000);

      const activities = await this.db.activity.findMany({
        where: {
          userId,
          date: { gte: startDate, lte: today },
        },
        select: { date: true, distanceKm: true, type: true },
      });

      // Initialiser toutes les dates avec 0
      const progressMap: Record<string, { bike: number; walk: number }> = {};
      for (let i = 0; i < 30; i++) {
        const d = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
        const key = d.toISOString().split("T")[0];
        progressMap[key] = { bike: 0, walk: 0 };
      }

      // Cumuler les distances par jour
      for (const act of activities) {
        const key = act.date.toISOString().split("T")[0];
        if (act.type === "VELO") {
          progressMap[key].bike += act.distanceKm;
        } else {
          progressMap[key].walk += act.distanceKm;
        }
      }

      // Convertir en tableau trié
      const allEntries = Object.entries(progressMap)
        .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
        .map(([date, { bike, walk }]) => ({
          date,
          bike: Math.round(bike * 10) / 10,
          walk: Math.round(walk * 10) / 10,
        }));

      // Appliquer la pagination
      const total = allEntries.length;
      const { skip, take, page, per_page } = pagination;
      const paginatedData = allEntries.slice(skip, skip + take);

      return {
        data: paginatedData,
        meta: { total, page, per_page, skip, take },
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("Erreur lors de la récupération de la progression utilisateur", 500, "DATABASE_ERROR");
    }
  }
}

export default new StatsService();
