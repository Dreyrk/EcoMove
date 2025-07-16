"use client";

import type React from "react";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/layout/layout";
import { Bike, Footprints, Calendar, Ruler, CheckCircle } from "lucide-react";

export default function Page() {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [activityType, setActivityType] = useState("");
  const [distance, setDistance] = useState("");
  const [steps, setSteps] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Mock data for existing activities (to prevent duplicates)
  const existingActivities = [
    { date: "2024-01-15", type: "bike", distance: 8.2 },
    { date: "2024-01-14", type: "walk", distance: 3.5 },
  ];

  const today = new Date().toISOString().split("T")[0];
  const hasActivityForDate = existingActivities.some((activity) => activity.date === date);
  const isDateInPast = date < today;
  const canEdit = !isDateInPast || date === today;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!activityType || (!distance && !steps)) {
      toast.error("Erreur de validation", {
        description: "Veuillez remplir tous les champs obligatoires",
      });
      return;
    }

    if (hasActivityForDate) {
      toast.error("Activité déjà existante", {
        description: "Vous ne pouvez enregistrer qu'une seule activité par jour",
      });
      return;
    }

    setIsSubmitting(true);

    // Mock API call
    setTimeout(() => {
      const finalDistance = activityType === "walk" && steps ? (Number.parseInt(steps) / 1500).toFixed(1) : distance;

      toast.success("Activité enregistrée !", {
        description: `${activityType === "bike" ? "Vélo" : "Marche"}: ${finalDistance} km enregistré le ${date}`,
      });

      // Reset form
      setDate(new Date().toISOString().split("T")[0]);
      setActivityType("");
      setDistance("");
      setSteps("");
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Enregistrer une activité</h1>
          <p className="text-muted-foreground">Enregistrez votre activité de mobilité douce quotidienne</p>
        </div>

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
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Date Selection */}
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  max={today}
                  required
                />
                {hasActivityForDate && (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>Vous avez déjà une activité enregistrée pour cette date.</AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Activity Type */}
              <div className="space-y-2">
                <Label htmlFor="activity-type">Type d&apos;activité</Label>
                <Select value={activityType} onValueChange={setActivityType} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un type d'activité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bike">
                      <div className="flex items-center space-x-2">
                        <Bike className="h-4 w-4 text-blue-500" />
                        <span>Vélo</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="walk">
                      <div className="flex items-center space-x-2">
                        <Footprints className="h-4 w-4 text-green-500" />
                        <span>Marche</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Distance/Steps Input */}
              {activityType && (
                <div className="space-y-4">
                  {activityType === "bike" ? (
                    <div className="space-y-2">
                      <Label htmlFor="distance">Distance (km)</Label>
                      <div className="relative">
                        <Ruler className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="distance"
                          type="number"
                          step="0.1"
                          min="0"
                          placeholder="Saisir la distance en kilomètres"
                          value={distance}
                          onChange={(e) => setDistance(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="distance">Distance (km)</Label>
                          <Input
                            id="distance"
                            type="number"
                            step="0.1"
                            min="0"
                            placeholder="Distance en km"
                            value={distance}
                            onChange={(e) => {
                              setDistance(e.target.value);
                              setSteps("");
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="steps">Ou nombre de pas</Label>
                          <Input
                            id="steps"
                            type="number"
                            min="0"
                            placeholder="Nombre de pas"
                            value={steps}
                            onChange={(e) => {
                              setSteps(e.target.value);
                              setDistance("");
                            }}
                          />
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                        <strong>Conversion:</strong> 1,500 pas = 1 km
                        {steps && (
                          <div className="mt-1">
                            <Badge variant="outline">
                              {steps} pas = {(Number.parseInt(steps) / 1500).toFixed(1)} km
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <div className="flex flex-col space-y-4">
                {!canEdit && (
                  <Alert variant="destructive">
                    <AlertDescription>
                      Les activités des dates passées ne peuvent être ni ajoutées ni modifiées.
                    </AlertDescription>
                  </Alert>
                )}
                <Button type="submit" className="w-full" disabled={isSubmitting || hasActivityForDate || !canEdit}>
                  {isSubmitting ? "Enregistrement..." : "Enregistrer une activité"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Activités récentes</CardTitle>
            <CardDescription>Vos dernières activités enregistrées</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {existingActivities.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center space-x-3">
                    {activity.type === "bike" ? (
                      <Bike className="h-4 w-4 text-blue-500" />
                    ) : (
                      <Footprints className="h-4 w-4 text-green-500" />
                    )}
                    <div>
                      <p className="font-medium">{activity.type === "bike" ? "Vélo" : "Marche"}</p>
                      <p className="text-sm text-muted-foreground">{activity.date}</p>
                    </div>
                  </div>
                  <Badge variant="secondary">{activity.distance} km</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
