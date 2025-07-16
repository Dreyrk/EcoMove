import { Users, Target, TrendingUp, Trophy } from "lucide-react";
import OverviewCard from "./overview-card";

interface ChallengeOverviewProps {
  stats: {
    totalParticipants: number;
    totalTeams: number;
    totalDistance: number;
    challengeDuration: number;
    co2Saved: number;
    avgDailyDistance: number;
  };
}

export default function ChallengeOverview({ stats }: ChallengeOverviewProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <OverviewCard title="Total Participants" icon={<Users className="h-4 w-4 text-muted-foreground" />}>
        <div className="text-2xl font-bold">{stats.totalParticipants}</div>
        <p className="text-xs text-muted-foreground">Across {stats.totalTeams} teams</p>
      </OverviewCard>
      <OverviewCard title="Total Distance" icon={<Target className="h-4 w-4 text-muted-foreground" />}>
        <div className="text-2xl font-bold">{stats.totalDistance.toLocaleString()} km</div>
        <p className="text-xs text-muted-foreground">In {stats.challengeDuration} days</p>
      </OverviewCard>
      <OverviewCard title="CO₂ Saved" icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}>
        <div className="text-2xl font-bold">{stats.co2Saved} kg</div>
        <p className="text-xs text-muted-foreground">Environmental impact</p>
      </OverviewCard>
      <OverviewCard title="Daily Average" icon={<Trophy className="h-4 w-4 text-muted-foreground" />}>
        <div className="text-2xl font-bold">{stats.avgDailyDistance} km</div>
        <p className="text-xs text-muted-foreground">Per participant</p>
      </OverviewCard>
    </div>
  );
}
