import { Users, Target, TrendingUp, Trophy } from "lucide-react";
import { ChallengeStatsType } from "@/types";
import OverviewCard from "./overview-card";

interface ChallengeOverviewProps {
  stats: ChallengeStatsType;
}

export default function ChallengeOverview({ stats }: ChallengeOverviewProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <OverviewCard title="Nombre total de participants" icon={<Users className="h-4 w-4 text-muted-foreground" />}>
        <div className="text-2xl font-bold">{stats.totalParticipants}</div>
        <p className="text-xs text-muted-foreground">Sur {stats.totalTeams} équipes</p>
      </OverviewCard>
      <OverviewCard title="Distance totale parcourue" icon={<Target className="h-4 w-4 text-muted-foreground" />}>
        <div className="text-2xl font-bold">{stats.totalDistance.toLocaleString()} km</div>
        <p className="text-xs text-muted-foreground">En {stats.challengeDuration} jours</p>
      </OverviewCard>
      <OverviewCard title="Économies de CO₂" icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}>
        <div className="text-2xl font-bold">{stats.co2Saved} kg</div>
        <p className="text-xs text-muted-foreground">Impact environnemental</p>
      </OverviewCard>
      <OverviewCard title="Moyenne quotidienne" icon={<Trophy className="h-4 w-4 text-muted-foreground" />}>
        <div className="text-2xl font-bold">{stats.avgDailyDistance} km</div>
        <p className="text-xs text-muted-foreground">Par participant</p>
      </OverviewCard>
    </div>
  );
}
