/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import { DashboardPage } from "@/components/admin/pages/dashboard-page";
import { UsersPage } from "@/components/admin/pages/users-page";
import { TeamsPage } from "@/components/admin/pages/teams-page";
import { ActivitiesPage, Activity } from "@/components/admin/pages/activities-page";
import Layout from "@/components/layout/layout";
import { Navigation } from "@/components/admin/navigation";
import LoadingPage from "@/components/loading-page";
import { getDataSafe } from "@/utils/getData";
import { PaginationType, Team } from "@/types";
import { User } from "@/components/providers/auth-provider";

const defaultMeta: PaginationType = {
  total: 0,
  skip: 0,
  take: 0,
  page: 1,
  per_page: 10,
};

export default function AdminDashboard() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [users, setUsers] = useState<User[]>([]);
  const [usersMeta, setUsersMeta] = useState<PaginationType>(defaultMeta);
  const [teamsMeta, setTeamsMeta] = useState<PaginationType>(defaultMeta);
  const [activitiesMeta, setActivitiesMeta] = useState<PaginationType>(defaultMeta);
  const [teams, setTeams] = useState<Team[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les données initiales
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [usersData, teamsData, activitiesData] = await Promise.all([
          getDataSafe<User[]>("api/admin/users", usersMeta),
          getDataSafe<Team[]>("api/admin/teams", teamsMeta),
          getDataSafe<Activity[]>("api/admin/activities", activitiesMeta),
        ]);

        if (usersData.data && teamsData.data && activitiesData.data) {
          const activitiesWithUserName = activitiesData.data.map((activity: Activity) => {
            const user = usersData.data?.find((u: User) => u.id === activity.user.id);
            return { ...activity, userName: user?.name || "Unknown" };
          });

          setUsers(usersData.data);
          setTeams(teamsData.data);
          setActivities(activitiesWithUserName);
          if (usersData.meta?.total) setUsersMeta(usersData.meta as PaginationType);
          if (teamsData.meta?.total) setTeamsMeta(teamsData.meta as PaginationType);
          if (activitiesData.meta?.total) setActivitiesMeta(activitiesData.meta as PaginationType);
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activitiesMeta.page, teamsMeta.page, usersMeta.page]);

  if (loading) return <LoadingPage />;
  if (error) return <div>{error}</div>;

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardPage users={users} teams={teams} activities={activities} />;
      case "users":
        return (
          <UsersPage
            users={users}
            setUsers={setUsers}
            teams={teams}
            onPageChange={(page) => setUsersMeta((meta) => ({ ...meta, page }))}
            meta={usersMeta}
          />
        );
      case "teams":
        return (
          <TeamsPage
            teams={teams}
            setTeams={setTeams}
            users={users}
            setUsers={setUsers}
            meta={teamsMeta}
            onPageChange={(page) => setTeamsMeta((meta) => ({ ...meta, page }))}
          />
        );
      case "activities":
        return (
          <ActivitiesPage
            activities={activities}
            setActivities={setActivities}
            users={users}
            meta={activitiesMeta}
            onPageChange={(page) => setActivitiesMeta((meta) => ({ ...meta, page }))}
          />
        );
      default:
        return <DashboardPage users={users} teams={teams} activities={activities} />;
    }
  };

  return (
    <Layout>
      <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
      {renderPage()}
    </Layout>
  );
}
