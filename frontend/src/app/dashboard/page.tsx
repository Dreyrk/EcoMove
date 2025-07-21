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
import { Button } from "@/components/ui/button";

// Valeurs par défaut utilisées avant le chargement des vraies stats
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
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        toast.error("Authentification requise");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Récupération des statistiques générales et des données de progression
        const [stats, progress] = await Promise.all([
          getDataSafe<UserStats>(`api/stats/users/${user.id}`),
          getDataSafe<DailyProgress[]>(`api/stats/users/${user.id}/progress`),
        ]);

        if (stats) setUserStats(stats.data || defaultUserStats);
        if (progress) setProgressData(progress.data || []);
      } catch (e) {
        setError(`Une erreur est survenue lors du chargement des données: ${(e as Error).message}`);
        toast.error("Erreur de chargement des données");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Affiche une page de chargement tant que les données ne sont pas disponibles
  if (isLoading) {
    return <LoadingPage />;
  }

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Réessayer
            </Button>
          </div>
        </div>
      </Layout>
    );
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
