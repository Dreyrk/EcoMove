"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/layout/layout";
import ExportButton from "@/components/stats/export-button";
import ChallengeOverview from "@/components/stats/challenge-overview";
import IndividualTable from "@/components/stats/individual-table";
import TeamTable from "@/components/stats/team-table";

// Mock data
const individualRankings = [
  { rank: 1, name: "Sarah Johnson", team: "Marketing", totalKm: 234.5, avgDaily: 7.8, badge: "gold" },
  { rank: 2, name: "Mike Chen", team: "Engineering", totalKm: 198.2, avgDaily: 6.6, badge: "silver" },
  { rank: 3, name: "John Doe", team: "Engineering", totalKm: 156.8, avgDaily: 5.2, badge: "bronze" },
  { rank: 4, name: "Emma Wilson", team: "Design", totalKm: 145.3, avgDaily: 4.8, badge: null },
  { rank: 5, name: "Alex Rodriguez", team: "Sales", totalKm: 132.7, avgDaily: 4.4, badge: null },
  { rank: 6, name: "Lisa Park", team: "HR", totalKm: 128.9, avgDaily: 4.3, badge: null },
  { rank: 7, name: "David Kim", team: "Engineering", totalKm: 124.1, avgDaily: 4.1, badge: null },
  { rank: 8, name: "Rachel Green", team: "Marketing", totalKm: 119.5, avgDaily: 4.0, badge: null },
  { rank: 9, name: "Tom Anderson", team: "Operations", totalKm: 115.2, avgDaily: 3.8, badge: null },
  { rank: 10, name: "Jennifer Lee", team: "Finance", totalKm: 112.8, avgDaily: 3.8, badge: null },
];

const teamRankings = [
  { rank: 1, name: "Engineering", totalKm: 1456.3, members: 12, avgPerUser: 121.4, badge: "gold" },
  { rank: 2, name: "Marketing", totalKm: 1234.7, members: 8, avgPerUser: 154.3, badge: "silver" },
  { rank: 3, name: "Design", totalKm: 987.2, members: 6, avgPerUser: 164.5, badge: "bronze" },
  { rank: 4, name: "Sales", totalKm: 876.5, members: 10, avgPerUser: 87.7, badge: null },
  { rank: 5, name: "Operations", totalKm: 654.3, members: 7, avgPerUser: 93.5, badge: null },
  { rank: 6, name: "HR", totalKm: 543.2, members: 4, avgPerUser: 135.8, badge: null },
  { rank: 7, name: "Finance", totalKm: 432.1, members: 5, avgPerUser: 86.4, badge: null },
];

const challengeStats = {
  totalParticipants: 247,
  totalDistance: 8456.7,
  totalTeams: 12,
  avgDailyDistance: 4.2,
  topActivityType: "Cycling",
  challengeDuration: 30,
  activeDays: 28,
  co2Saved: 1234.5, // kg
};

export default function StatsPage() {
  const [isExporting, setIsExporting] = useState(false);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Statistiques & Classements</h1>
            <p className="text-muted-foreground">Tableaux de classement et statistiques du challenge</p>
          </div>
          <ExportButton data={individualRankings} isExporting={isExporting} setIsExporting={setIsExporting} />
        </div>

        <ChallengeOverview stats={challengeStats} />

        <Tabs defaultValue="individual" className="space-y-4">
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
