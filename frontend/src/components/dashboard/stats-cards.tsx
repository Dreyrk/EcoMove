import { Target, Calendar, Trophy, TrendingUp } from "lucide-react";
import StatCard from "./stat-card";

interface StatsCardsProps {
  stats: {
    totalKm: number;
    dailyAverage: number;
    daysActive: number;
    individualRank: number;
    totalUsers: number;
    streak: number;
  };
}

export default function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Distance"
        icon={<Target className="h-4 w-4 text-muted-foreground" />}
        value={`${stats.totalKm} km`}
        subtitle="+12.3 km depuis la semaine dernière"
      />
      <StatCard
        title="Moyenne journalière"
        icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
        value={`${stats.dailyAverage} km`}
        subtitle={`Sur ${stats.daysActive} jours d'activité`}
      />
      <StatCard
        title="Classement individuel"
        icon={<Trophy className="h-4 w-4 text-muted-foreground" />}
        value={`#${stats.individualRank}`}
        subtitle={`sur ${stats.totalUsers} participants`}
      />
      <StatCard
        title="Série en cours"
        icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
        value={`${stats.streak} jours`}
        subtitle="Continuez comme ça !"
      />
    </div>
  );
}
