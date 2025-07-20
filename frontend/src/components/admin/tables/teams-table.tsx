import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Team } from "@/types";
import { Edit, Trash2 } from "lucide-react";

type TeamsTableProps = {
  teams: Team[];
  setEditingTeam: (team: Team) => void;
  setIsModalOpen: (isModalOpen: boolean) => void;
  setDeleteTeamId: (teamId: number) => void;
  getUserCount: (teamId: number) => number;
};

export default function TeamsTable({
  teams,
  setEditingTeam,
  setIsModalOpen,
  setDeleteTeamId,
  getUserCount,
}: TeamsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Nom</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Membres</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {teams.map((team) => (
          <TableRow key={team.id}>
            <TableCell>{team.id}</TableCell>
            <TableCell>{team.name}</TableCell>
            <TableCell>{team.description || "-"}</TableCell>
            <TableCell>{getUserCount(team.id)} utilisateurs</TableCell>
            <TableCell className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditingTeam(team);
                  setIsModalOpen(true);
                }}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  setDeleteTeamId(team.id);
                }}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
