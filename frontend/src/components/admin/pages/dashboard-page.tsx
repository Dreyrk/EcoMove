"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Users2, Activity, MapPin } from "lucide-react";
import type { User, Team, Activity as ActivityType } from "@/app/admin/management/page";

interface DashboardPageProps {
  users: User[];
  teams: Team[];
  activities: ActivityType[];
}

export function DashboardPage({ users, teams, activities }: DashboardPageProps) {
  const totalKilometers = activities.reduce((sum, activity) => sum + activity.distanceKm, 0);

  const metrics = [
    {
      title: "Total Utilisateurs",
      value: users.length,
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Total Équipes",
      value: teams.length,
      icon: Users2,
      color: "text-green-600",
    },
    {
      title: "Total Activités",
      value: activities.length,
      icon: Activity,
      color: "text-purple-600",
    },
    {
      title: "Total Kilomètres",
      value: totalKilometers.toFixed(1),
      icon: MapPin,
      color: "text-orange-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-600">Aperçu des métriques du système</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{metric.title}</CardTitle>
                <Icon className={`h-4 w-4 ${metric.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Activités récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{activity.userName}</p>
                    <p className="text-sm text-gray-600">
                      {activity.type} - {activity.distanceKm}km
                    </p>
                  </div>
                  <div className="text вы-sm text-gray-500">{new Date(activity.date).toLocaleDateString()}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Aperçu des équipes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teams.map((team) => {
                const teamUserCount = users.filter((user) => user.teamId === team.id).length;
                return (
                  <div key={team.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{team.name}</p>
                      <p className="text-sm text-gray-600">{team.description || "-"}</p>
                    </div>
                    <div className="text-sm text-gray-500">{teamUserCount} utilisateurs</div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
