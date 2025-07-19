"use client";

import { toast } from "sonner";
import Layout from "@/components/layout/layout";
import { useAuth } from "@/components/providers/auth-provider";
import StatsCards from "@/components/dashboard/stats-cards";
import ActivityBreakdown from "@/components/dashboard/activity-breakdown";
import ProgressSection from "@/components/dashboard/progress-section";
import RankingsSection from "@/components/dashboard/rankings-section";
import QuickActions from "@/components/dashboard/quick-actions";
import { useEffect, useState } from "react";
import { getDataSafe } from "@/utils/getData";
import { DailyProgress, UserStats } from "@/types";
import LoadingPage from "@/components/loading-page";

const defaultUserStats: UserStats = {
  totalKm: 0,
  bikeKm: 0,
  walkKm: 0,
  dailyAverage: 0,
  individualRank: 0,
  teamRank: 0,
  totalUsers: 0,
  totalTeams: 0,
  daysActive: 0,
  streak: 0,
};

export default function Page() {
  const { user } = useAuth();
  const [userStats, setUserStats] = useState<UserStats>(defaultUserStats);
  const [progressData, setProgressData] = useState<DailyProgress[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        toast.error("Authentication required");
        return;
      }

      const stats = await getDataSafe<UserStats>(`api/stats/users/id/${user.id}`);
      const progress = await getDataSafe<DailyProgress[]>(`api/stats/users/id/${user.id}/progress`);

      if (stats) setUserStats(stats.data);
      if (progress) setProgressData(progress.data);
    };

    fetchData();
  }, [user]);

  if (!progressData.length) {
    return <LoadingPage />;
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ravi de vous revoir, {user?.name}!</h1>
          <p className="text-muted-foreground">Voici vos progrès en matière de mobilité douce</p>
        </div>

        <StatsCards stats={userStats} />

        <div className="grid gap-6 lg:grid-cols-3">
          <ActivityBreakdown stats={userStats} />
          <ProgressSection data={progressData} />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <RankingsSection stats={userStats} team={user?.team} />
          <QuickActions />
        </div>
      </div>
    </Layout>
  );
}
