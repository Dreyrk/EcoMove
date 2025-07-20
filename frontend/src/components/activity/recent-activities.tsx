import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bike, Footprints } from "lucide-react";
import { ActivityDataType } from "@/types";
import formatDateFr from "@/utils/formatDateFr";
import { Loader } from "../ui/loader";

interface RecentActivitiesProps {
  activities: ActivityDataType[] | null;
  loading: boolean;
}

export default function RecentActivities({ activities, loading }: RecentActivitiesProps) {
  if (loading || !activities) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Activités récentes</CardTitle>
          <CardDescription>Vos dernières activités enregistrées</CardDescription>
        </CardHeader>
        <CardContent>
          <Loader variant="dots" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activités récentes</CardTitle>
        <CardDescription>Vos dernières activités enregistrées</CardDescription>
      </CardHeader>
      <CardContent>
        {activities.length > 0 ? (
          <div className="space-y-3">
            {activities.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center space-x-3">
                  {activity.type === "VELO" ? (
                    <Bike className="h-4 w-4 text-blue-500" />
                  ) : (
                    <Footprints className="h-4 w-4 text-green-500" />
                  )}
                  <div>
                    <p className="font-medium">{activity.type === "VELO" ? "Vélo" : "Marche"}</p>
                    <p className="text-sm text-muted-foreground">{formatDateFr(new Date(activity.date))}</p>
                  </div>
                </div>
                <Badge variant="secondary">{activity.distanceKm} km</Badge>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-center italic font-light text-gray-700">
            Pas encore d&apos;activités enregistrées...
          </p>
        )}
      </CardContent>
    </Card>
  );
}
