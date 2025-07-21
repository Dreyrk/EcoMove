"use server";

import Layout from "@/components/layout/layout";
import ActivityForm from "@/components/activity/activity-form";
import RecentActivities from "@/components/activity/recent-activities";
import formatDateFr from "@/utils/formatDateFr";
import { ActivityDataType } from "@/types";
import LoadingPage from "@/components/loading-page";
import { getDataSafe } from "@/utils/getData";
import { User } from "@/components/providers/auth-provider";

export default async function Page() {
  const date = formatDateFr(new Date());
  const { data: user } = await getDataSafe<User>(`api/auth/profile`);

  if (!user) {
    return <LoadingPage />;
  }

  const activities = await getDataSafe<ActivityDataType[]>(`api/activities/user/${user.id}`);

  // Vérifie si une activité est déjà enregistrée pour aujourd’hui
  const hasActivityForDate =
    activities.data?.some((activity) => formatDateFr(new Date(activity.date)) === date) ?? false;

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        <ActivityForm hasActivityForDate={hasActivityForDate} existingActivities={activities.data} />
        <RecentActivities activities={activities.data} loading={!activities.data} />
      </div>
    </Layout>
  );
}
