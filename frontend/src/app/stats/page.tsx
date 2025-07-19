"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/layout/layout";
import ExportButton from "@/components/stats/export-button";
import ChallengeOverview from "@/components/stats/challenge-overview";
import IndividualTable from "@/components/stats/individual-table";
import TeamTable from "@/components/stats/team-table";
import { IndividualRankingType, TeamRankingType, ChallengeStatsType } from "@/types";
import { getDataSafe } from "@/utils/getData";
import { isEmptyObject } from "@/utils/isEmptyObject";
import LoadingPage from "@/components/loading-page";

const defaultChallengeStats = {
  totalParticipants: 0,
  totalDistance: 0,
  totalTeams: 0,
  avgDailyDistance: 0,
  topActivityType: "Marche",
  challengeDuration: 0,
  activeDays: 0,
  co2Saved: 0,
};

export default function StatsPage() {
  const [isExporting, setIsExporting] = useState(false);
  const [tabSelected, setTabSelected] = useState<"individual" | "team">("individual");
  const [individualRankings, setIndividualRankings] = useState<IndividualRankingType[]>([]);
  const [teamRankings, setTeamRankings] = useState<TeamRankingType[]>([]);
  const [challengeStats, setChallengeStats] = useState<ChallengeStatsType>(defaultChallengeStats);

  useEffect(() => {
    const fetchData = async () => {
      const individualRankingsData = await getDataSafe<IndividualRankingType[]>(`api/stats/users/rankings`);
      const teamRankingsData = await getDataSafe<TeamRankingType[]>(`api/stats/teams/rankings`);
      const challengeStatsData = await getDataSafe<ChallengeStatsType>(`api/stats/general`);

      if (individualRankingsData) setIndividualRankings(individualRankingsData.data || []);
      if (teamRankingsData) setTeamRankings(teamRankingsData.data || []);
      if (challengeStatsData) setChallengeStats(challengeStatsData.data || defaultChallengeStats);
    };

    fetchData();
  }, []);

  if (isEmptyObject(challengeStats) || !teamRankings.length || !individualRankings.length) {
    return <LoadingPage />;
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Statistiques & Classements</h1>
            <p className="text-muted-foreground">Tableaux de classement et statistiques du challenge</p>
          </div>
          <ExportButton
            data={tabSelected === "individual" ? individualRankings : teamRankings}
            isExporting={isExporting}
            setIsExporting={setIsExporting}
          />
        </div>

        <ChallengeOverview stats={challengeStats} />

        <Tabs
          defaultValue={tabSelected}
          value={tabSelected}
          onValueChange={(value) => setTabSelected(value as "individual" | "team")}
          className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="individual">Classement individuel</TabsTrigger>
            <TabsTrigger value="team">Classement par équipe</TabsTrigger>
          </TabsList>

          <TabsContent value="individual">
            <IndividualTable data={individualRankings} />
          </TabsContent>

          <TabsContent value="team">
            <TeamTable data={teamRankings} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
