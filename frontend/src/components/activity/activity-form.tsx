"use client";

import { useState, useEffect, useActionState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar, CheckCircle } from "lucide-react";
import { useAuth } from "../providers/auth-provider";
import DateInput from "./activity-date-input";
import ActivityTypeSelect from "./activity-type-select";
import DistanceStepsInput from "./distance-steps-input";
import { ActivityDataType, FormState } from "@/types";
import submitActivity, { ActivityFields } from "@/actions/activity/submitActivity";
import SubmitButton from "../ui/submit-button";
import LoadingPage from "../loading-page";
import formatDateFr from "@/utils/formatDateFr";
import DailyActivitySubmitted from "./daily-activity-submitted";
import { toast } from "sonner";

interface ActivityFormProps {
  existingActivities: ActivityDataType[] | null;
  hasActivityForDate: boolean;
}

const initialState: FormState<ActivityFields> = {
  success: false,
  errors: {},
};

export default function ActivityForm({ existingActivities, hasActivityForDate }: ActivityFormProps) {
  const { user } = useAuth();
  const [state, formAction, isPending] = useActionState(submitActivity, initialState);
  const [activityType, setActivityType] = useState<"VELO" | "MARCHE">("MARCHE");
  const [distance, setDistance] = useState<number>(0);
  const [steps, setSteps] = useState<number>(0);
  const [date, setDate] = useState(formatDateFr(new Date()));

  // Réinitialiser le formulaire après succès
  useEffect(() => {
    if (state.success) {
      setActivityType("MARCHE");
      setDistance(0);
      setSteps(0);
      setDate(formatDateFr(new Date()));
      toast.success("Activité journalière enregistrée !", {
        description: "Revenez demain pour enregistrer la suivante.",
      });
    }
  }, [state.success]);

  if (!user?.id || !existingActivities) {
    return <LoadingPage />;
  }

  if (hasActivityForDate) {
    return <DailyActivitySubmitted />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="h-5 w-5" />
          <span>Enregistrement de l&apos;activité du jour</span>
        </CardTitle>
        <CardDescription>
          Enregistrez une activité par jour. Les activités passées ne peuvent pas être modifiées.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          {/* Champ caché pour récuperer userId */}
          <input type="hidden" name="userId" value={user?.id} />

          <DateInput date={date} setDate={setDate} hasActivityForDate={hasActivityForDate} error={state.errors.date} />
          <ActivityTypeSelect activityType={activityType} setActivityType={setActivityType} error={state.errors.type} />

          {activityType && (
            <DistanceStepsInput
              activityType={activityType}
              distance={distance}
              setDistance={setDistance}
              steps={steps}
              setSteps={setSteps}
              errorDistance={state.errors.distanceKm}
              errorSteps={state.errors.steps}
            />
          )}

          <div className="flex flex-col space-y-4">
            {/* Message de succès */}
            {state.success && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">Enregistrement réussi !</AlertDescription>
              </Alert>
            )}
            <SubmitButton text="Enregistrer une activité" pendingText="Enregistrement..." isPending={isPending} />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
