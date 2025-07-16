import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trophy, Medal, Crown } from "lucide-react";

interface IndividualTableProps {
  data: {
    rank: number;
    name: string;
    team: string;
    totalKm: number;
    avgDaily: number;
    badge: string | null;
  }[];
}

export default function IndividualTable({ data }: IndividualTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Trophy className="h-5 w-5" />
          <span>Top 10 participants individuels</span>
        </CardTitle>
        <CardDescription>Classés par distance totale parcourue</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Rang</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Équipe</TableHead>
              <TableHead className="text-right">Total km</TableHead>
              <TableHead className="text-right">Moyenne / jour</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((user) => (
              <TableRow key={user.rank}>
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-2">
                    {getBadgeIcon(user.badge)}
                    <span>#{user.rank}</span>
                  </div>
                </TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">{user.team}</Badge>
                </TableCell>
                <TableCell className="text-right font-mono">{user.totalKm} km</TableCell>
                <TableCell className="text-right font-mono text-muted-foreground">{user.avgDaily} km/jour</TableCell>
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
