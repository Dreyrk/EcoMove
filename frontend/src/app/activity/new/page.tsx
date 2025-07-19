"use client";

import { useEffect, useState } from "react";
import { getDataSafe } from "@/utils/getData";
import { useAuth } from "@/components/providers/auth-provider";
import Layout from "@/components/layout/layout";
import ActivityForm from "@/components/activity/activity-form";
import RecentActivities from "@/components/activity/recent-activities";
import { ActivityDataType } from "@/types";

export default function ActivityPage() {
  const { user } = useAuth();
  const [activities, setActivities] = useState<ActivityDataType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    const fetchActivities = async () => {
      if (user?.id) {
        const activitiesData = await getDataSafe<ActivityDataType[]>(`api/activities/user/${user.id}`);
        return setActivities(activitiesData.data);
      }
    };
    fetchActivities();
    setLoading(false);
  }, [user]);

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        <ActivityForm existingActivities={activities} />
        <RecentActivities loading={loading} activities={activities} />
      </div>
    </Layout>
  );
}
