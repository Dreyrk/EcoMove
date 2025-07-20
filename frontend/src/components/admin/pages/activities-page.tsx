"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ActivityModal } from "@/components/admin/activity-modal";
import ActivitiesTable from "../tables/activities-table";
import { Pagination } from "../tables/pagination";
import { ActivityDataType, PaginationType } from "@/types";
import { User } from "@/components/providers/auth-provider";
import { Search } from "lucide-react";

export interface Activity extends Omit<ActivityDataType, "userId"> {
  user: {
    id: number;
    name: string;
    teamId: number;
  };
}

interface ActivitiesPageProps {
  activities: Activity[];
  setActivities: (activities: Activity[]) => void;
  users: User[];
  meta: PaginationType;
  onPageChange: (page: number) => void;
}

export function ActivitiesPage({ activities, users, meta, onPageChange }: ActivitiesPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [userFilter, setUserFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateFromFilter, setDateFromFilter] = useState("");
  const [dateToFilter, setDateToFilter] = useState("");
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  const filteredActivities = activities.filter((activity) => {
    const matchesSearch = activity.user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const matchesUser = userFilter === "all" || activity.user.id === Number(userFilter);
    const matchesType = typeFilter === "all" || activity.type === typeFilter;
    const matchesDateFrom = !dateFromFilter || activity.date >= dateFromFilter;
    const matchesDateTo = !dateToFilter || activity.date <= dateToFilter;

    return matchesSearch && matchesUser && matchesType && matchesDateFrom && matchesDateTo;
  });

  const getActivityTypeColor = (type: string) => {
    switch (type) {
      case "VELO":
        return "bg-blue-100 text-blue-800";
      case "MARCHE":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDistance = (activity: Activity) => {
    if (activity.type === "MARCHE") {
      return `${activity.distanceKm}km (${activity.steps || Math.round(activity.distanceKm * 1500)} pas)`;
    }
    return `${activity.distanceKm}km`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestion des activités</h1>
        <p className="text-gray-600">Suivre et gérer les activités des utilisateurs</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher des activités..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={userFilter} onValueChange={setUserFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrer par utilisateur" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les utilisateurs</SelectItem>
                {users.map((user) => (
                  <SelectItem key={user.id} value={String(user.id)}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrer par type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="VELO">Vélo</SelectItem>
                <SelectItem value="MARCHE">Marche</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="date"
              placeholder="Date de début"
              value={dateFromFilter}
              onChange={(e) => setDateFromFilter(e.target.value)}
            />
            <Input
              type="date"
              placeholder="Date de fin"
              value={dateToFilter}
              onChange={(e) => setDateToFilter(e.target.value)}
            />
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Activités ({filteredActivities.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <ActivitiesTable
            activities={filteredActivities}
            formatDistance={formatDistance}
            getActivityTypeColor={getActivityTypeColor}
            setSelectedActivity={setSelectedActivity}
          />
          <Pagination {...meta} dataName="Activités" onPageChange={onPageChange} />
        </CardContent>
      </Card>

      <ActivityModal
        activity={selectedActivity}
        isOpen={!!selectedActivity}
        onClose={() => setSelectedActivity(null)}
      />
    </div>
  );
}
