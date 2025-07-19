"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Calendar } from "lucide-react";

export default function DailyActivitySubmitted() {
  const currentDate = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-4">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <CardTitle className="text-xl font-semibold text-green-700">Activité Enregistrée !</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="text-center text-muted-foreground">
          <p className="mb-2">Vous avez déjà enregistré votre activité journalière aujourd&apos;hui.</p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Date:</span>
            <span>{currentDate}</span>
          </div>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>Revenez demain pour enregistrer votre prochaine activité !</p>
        </div>
      </CardContent>
    </Card>
  );
}
