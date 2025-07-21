import { Target, Calendar, Trophy, TrendingUp } from "lucide-react";
import StatCard from "./stat-card";
import { UserStats } from "@/types";

interface StatsCardsProps {
  stats: UserStats;
}

export default function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Distance"
        icon={<Target className="h-4 w-4 text-muted-foreground" />}
        value={`${stats.totalKm} km`}
        subtitle=""
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
        subtitle={streakMessage(stats.streak)}
      />
    </div>
  );
}

function streakMessage(streak: number): string {
  if (streak <= 0) {
    return "Un petit effort !";
  } else if (streak === 1) {
    return "Courage !";
  } else if (streak === 2 || streak === 3) {
    return "Bien joué !";
  } else if (streak >= 4 && streak <= 6) {
    return "Continue comme ça !";
  } else if (streak >= 7 && streak <= 10) {
    return "Tu es en feu ! 🔥";
  } else {
    return "Quel Pro ! 🤯";
  }
}
