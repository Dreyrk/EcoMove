"use client";

import Layout from "@/components/layout/layout";
import { useAuth } from "@/components/providers/auth-provider";
import StatsCards from "@/components/dashboard/stats-cards";
import ActivityBreakdown from "@/components/dashboard/activity-breakdown";
import ProgressSection from "@/components/dashboard/progress-section";
import RankingsSection from "@/components/dashboard/rankings-section";
import QuickActions from "@/components/dashboard/quick-actions";

// Mock data
const userStats = {
  totalKm: 156.8,
  bikeKm: 98.2,
  walkKm: 58.6,
  dailyAverage: 5.2,
  individualRank: 3,
  teamRank: 1,
  totalUsers: 247,
  totalTeams: 12,
  daysActive: 28,
  streak: 7,
};

const progressData = [
  { date: "2024-01-01", bike: 4.2, walk: 2.1 },
  { date: "2024-01-02", bike: 6.8, walk: 1.8 },
  { date: "2024-01-03", bike: 3.2, walk: 3.2 },
  { date: "2024-01-04", bike: 8.1, walk: 0 },
  { date: "2024-01-05", bike: 5.4, walk: 2.8 },
  { date: "2024-01-06", bike: 0, walk: 4.5 },
  { date: "2024-01-07", bike: 7.2, walk: 1.2 },
  { date: "2024-01-08", bike: 4.8, walk: 3.1 },
  { date: "2024-01-09", bike: 6.2, walk: 2.4 },
  { date: "2024-01-10", bike: 5.1, walk: 1.9 },
  { date: "2024-01-11", bike: 3.8, walk: 4.2 },
  { date: "2024-01-12", bike: 7.5, walk: 0 },
  { date: "2024-01-13", bike: 4.2, walk: 2.8 },
  { date: "2024-01-14", bike: 6.1, walk: 1.5 },
  { date: "2024-01-15", bike: 5.8, walk: 3.2 },
];

export default function Page() {
  const { user } = useAuth();

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
