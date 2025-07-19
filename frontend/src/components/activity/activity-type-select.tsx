import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Bike, Footprints } from "lucide-react";

interface ActivityTypeSelectProps {
  activityType: "VELO" | "MARCHE";
  setActivityType: (type: "VELO" | "MARCHE") => void;
  error?: string[];
}

export default function ActivityTypeSelect({ activityType, setActivityType, error }: ActivityTypeSelectProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="activity-type">Type d&apos;activité</Label>
      <Select name="type" value={activityType} onValueChange={setActivityType} required>
        <SelectTrigger>
          <SelectValue placeholder="Sélectionnez un type d'activité" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="VELO">
            <div className="flex items-center space-x-2">
              <Bike className="h-4 w-4 text-blue-500" />
              <span>Vélo</span>
            </div>
          </SelectItem>
          <SelectItem value="MARCHE">
            <div className="flex items-center space-x-2">
              <Footprints className="h-4 w-4 text-green-500" />
              <span>Marche</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
      {error?.length && <p className="text-sm text-red-600">{error.join(", ")}</p>}
    </div>
  );
}
