import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Medal, Crown } from "lucide-react";

interface TeamTableProps {
  data: {
    rank: number;
    name: string;
    members: number;
    totalKm: number;
    avgPerUser: number;
    badge: string | null;
  }[];
}

export default function TeamTable({ data }: TeamTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="h-5 w-5" />
          <span>Classement des équipes</span>
        </CardTitle>
        <CardDescription>Équipes classées par distance totale et moyenne par membre</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Rang</TableHead>
              <TableHead>Équipe</TableHead>
              <TableHead className="text-right">Membres</TableHead>
              <TableHead className="text-right">Total km</TableHead>
              <TableHead className="text-right">Moyenne / membre</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((team) => (
              <TableRow key={team.rank}>
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-2">
                    {getBadgeIcon(team.badge)}
                    <span>#{team.rank}</span>
                  </div>
                </TableCell>
                <TableCell>{team.name}</TableCell>
                <TableCell className="text-right">{team.members}</TableCell>
                <TableCell className="text-right font-mono">{team.totalKm.toLocaleString()} km</TableCell>
                <TableCell className="text-right font-mono text-muted-foreground">{team.avgPerUser} km</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function getBadgeIcon(badge: string | null, size = "h-4 w-4") {
  switch (badge) {
    case "gold":
      return <Crown className={`${size} text-yellow-500`} />;
    case "silver":
      return <Medal className={`${size} text-gray-400`} />;
    case "bronze":
      return <Medal className={`${size} text-amber-600`} />;
    default:
      return null;
  }
}
