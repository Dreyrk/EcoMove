/* eslint-disable @typescript-eslint/no-explicit-any */
export type APIMetaData = {
  page: number;
  per_page: number;
  skip: number;
  take: number;
};

export interface APIResponse<T> {
  status: "success" | "error";
  data: T | null;
  meta?: {
    total?: number;
    page?: number;
    per_page?: number;
    totalPage?: number;
    skip?: number;
    take?: number;
    message?: string;
  };
  message?: string;
}

export interface APIErrorResponse {
  status: "error";
  message: string;
  data?: {
    code: string;
  };
}

export type UserStats = {
  totalKm: number;
  bikeKm: number;
  walkKm: number;
  dailyAverage: number;
  individualRank: number;
  teamRank: number;
  totalUsers: number;
  totalTeams: number;
  daysActive: number;
  streak: number;
};

export type DailyProgress = {
  date: string;
  bike: number;
  walk: number;
};

export type IndividualRankingType = {
  rank: number;
  name: string;
  team: string;
  totalKm: number;
  avgDaily: number;
  badge: "gold" | "silver" | "bronze" | null;
};

export type TeamRankingType = {
  rank: number;
  name: string;
  totalKm: number;
  members: number;
  avgPerUser: number;
  badge: "gold" | "silver" | "bronze" | null;
};

export type ChallengeStatsType = {
  totalParticipants: number;
  totalDistance: number;
  totalTeams: number;
  avgDailyDistance: number;
  topActivityType: string;
  challengeDuration: number;
  activeDays: number;
  co2Saved?: number;
};

export type TeamType = { id: number; name: string };

export type FormState<T extends Record<string, any>> = {
  success: boolean;
  errors: {
    [K in keyof T]?: string[];
  };
};

export type ActivityDataType = {
  id: number;
  userId: number;
  date: string;
  type: "VELO" | "MARCHE";
  distanceKm: number;
  steps?: number | null;
  createdAt?: number;
};

export type Team = {
  id: number;
  name: string;
  description?: string;
  createdAt?: string;
};

export interface PaginationType {
  total: number;
  skip: number;
  take: number;
  page: number;
  per_page: number;
}
