"use server";

import Layout from "@/components/layout/layout";
import ActivityForm from "@/components/activity/activity-form";
import RecentActivities from "@/components/activity/recent-activities";
import formatDateFr from "@/utils/formatDateFr";
import { getServerSideProfile } from "@/actions/auth/getServerProfile";
import { getServerDataSafe } from "@/utils/getServerData";
import { ActivityDataType } from "@/types";
import LoadingPage from "@/components/loading-page";

export default async function Page() {
  const date = formatDateFr(new Date());
  const user = await getServerSideProfile();

  if (!user) {
    return <LoadingPage />;
  }

  const activities = await getServerDataSafe<ActivityDataType[]>(`api/activities/user/${user.id}`);

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
