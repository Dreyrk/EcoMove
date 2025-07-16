import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bike, Footprints } from "lucide-react";
import ActivityItem from "./activity-item";

interface ActivityBreakdownProps {
  stats: {
    totalKm: number;
    bikeKm: number;
    walkKm: number;
  };
}

export default function ActivityBreakdown({ stats }: ActivityBreakdownProps) {
  const bikePercent = (stats.bikeKm / stats.totalKm) * 100;
  const walkPercent = (stats.walkKm / stats.totalKm) * 100;

  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle>Répartition de l&apos;activité</CardTitle>
        <CardDescription>Vos transports eco-friendlys</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ActivityItem
          label="Vélo"
          icon={<Bike className="h-4 w-4 text-blue-500" />}
          value={stats.bikeKm}
          percent={bikePercent}
        />
        <ActivityItem
          label="Marche"
          icon={<Footprints className="h-4 w-4 text-green-500" />}
          value={stats.walkKm}
          percent={walkPercent}
        />
      </CardContent>
    </Card>
  );
}
