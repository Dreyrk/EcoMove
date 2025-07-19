import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Ruler } from "lucide-react";
import { cn } from "@/lib/utils";

interface DistanceStepsInputProps {
  activityType: string;
  distance: number;
  setDistance: (distance: number) => void;
  steps: number;
  setSteps: (steps: number) => void;
  errorDistance?: string[];
  errorSteps?: string[];
}

export default function DistanceStepsInput({
  activityType,
  distance,
  setDistance,
  steps,
  setSteps,
  errorDistance,
  errorSteps,
}: DistanceStepsInputProps) {
  return (
    <div className="space-y-4">
      {activityType === "VELO" ? (
        // Affichage spécifique pour le vélo : uniquement la distance
        <div className="space-y-2">
          <Label htmlFor="distanceKm">Distance (km)</Label>
          <div className="relative">
            <Ruler className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="distanceKm"
              name="distanceKm"
              type="number"
              step="0.1"
              min="0"
              placeholder="Saisir la distance en kilomètres"
              value={distance}
              onChange={(e) => setDistance(Number(e.target.value))}
              className={cn(`pl-10`, errorDistance?.length ? "border-red-500" : "")}
              required
            />
          </div>
          {errorDistance?.length && <p className="text-sm text-red-600">{errorDistance.join(", ")}</p>}
        </div>
      ) : (
        // Pour la marche : distance ou nombre de pas
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="distanceKm">Distance (km)</Label>
              <Input
                id="distanceKm"
                name="distanceKm"
                type="number"
                step="0.1"
                min="0"
                placeholder="Distance en km"
                className={errorDistance?.length ? "border-red-500" : ""}
                value={distance}
                onChange={(e) => {
                  setDistance(Number(e.target.value));
                  setSteps(getStepsWithDistance(Number(e.target.value)));
                }}
              />
              {errorDistance?.length && <p className="text-sm text-red-600">{errorDistance.join(", ")}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="steps">Ou nombre de pas</Label>
              <Input
                id="steps"
                name="steps"
                type="number"
                min="0"
                placeholder="Nombre de pas"
                className={errorSteps?.length ? "border-red-500" : ""}
                value={steps}
                onChange={(e) => {
                  setSteps(Number(e.target.value));
                  setDistance(getDistanceWithSteps(Number(e.target.value)));
                }}
              />
              {errorSteps?.length && <p className="text-sm text-red-600">{errorSteps.join(", ")}</p>}
            </div>
          </div>
          <div className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
            <strong>Conversion:</strong> 1,500 pas = 1 km
            {steps > 0 && (
              <div className="mt-1">
                <Badge variant="outline">
                  {steps} pas = {getDistanceWithSteps(Number(steps))} km
                </Badge>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Convertit des pas en kilomètres
function getDistanceWithSteps(steps: number): number {
  return Number((steps / 1500).toFixed(1));
}

// Convertit des kilomètres en pas
function getStepsWithDistance(distance: number): number {
  return distance * 1500;
}
