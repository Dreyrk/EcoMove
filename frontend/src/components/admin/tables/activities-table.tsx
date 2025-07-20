import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import formatDateFr from "@/utils/formatDateFr";
import { Eye } from "lucide-react";
import { Activity } from "../pages/activities-page";

type ActivitiesTableProps = {
  activities: Activity[];
  getActivityTypeColor: (type: "MARCHE" | "VELO") => string;
  formatDistance: (activity: Activity) => string;
  setSelectedActivity: (selectedActivity: Activity) => void;
};

export default function ActivitiesTable({
  activities,
  getActivityTypeColor,
  formatDistance,
  setSelectedActivity,
}: ActivitiesTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Utilisateur</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Distance</TableHead>
          <TableHead>Créé le</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {activities.map((activity) => (
          <TableRow key={activity.id}>
            <TableCell className="font-medium">{activity.id}</TableCell>
            <TableCell>{activity.user.name}</TableCell>
            <TableCell>{new Date(activity.date).toLocaleDateString()}</TableCell>
            <TableCell>
              <Badge className={getActivityTypeColor(activity.type)}>{activity.type}</Badge>
            </TableCell>
            <TableCell>{formatDistance(activity)}</TableCell>
            <TableCell>{formatDateFr(new Date(activity.createdAt || 0))}</TableCell>
            <TableCell>
              <Button variant="outline" size="sm" onClick={() => setSelectedActivity(activity)}>
                <Eye className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
