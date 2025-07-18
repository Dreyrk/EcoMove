import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import RankingItem from "./ranking-item";

interface RankingsSectionProps {
  stats: {
    individualRank: number;
    teamRank: number;
  };
  team?: { id: number; name: string };
}

export default function RankingsSection({ stats, team }: RankingsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Trophy className="h-5 w-5" />
          <span>Vos classements</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <RankingItem
          title="Classement individuel"
          description="Parmi tous les participants"
          value={`#${stats.individualRank}`}
          variant="secondary"
        />
        <RankingItem
          title="Classement de l'équipe"
          description={`Position de l'équipe ${team?.name}`}
          value={`#${stats.teamRank}`}
          variant="default"
        />
      </CardContent>
    </Card>
  );
}
