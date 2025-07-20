"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search } from "lucide-react";
import { TeamModal } from "@/components/admin/team-modal";
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";
import { toast } from "sonner";
import { PaginationType, Team } from "@/types";
import { User } from "@/components/providers/auth-provider";
import TeamsTable from "../tables/teams-table";
import { Pagination } from "../tables/pagination";

interface TeamsPageProps {
  teams: Team[];
  setTeams: (teams: Team[]) => void;
  users: User[];
  setUsers: (users: User[]) => void;
  meta: PaginationType;
  onPageChange: (page: number) => void;
}

export function TeamsPage({ teams, setTeams, users, setUsers, meta, onPageChange }: TeamsPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [deleteTeamId, setDeleteTeamId] = useState<number | null>(null);

  const filteredTeams = teams.filter(
    (team) =>
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (team.description ?? "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleCreateTeam = async (teamData: Omit<Team, "id" | "createdAt">) => {
    try {
      const response = await fetch(`${API_URL}/api/teams`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(teamData),
      });
      if (!response.ok) throw new Error("Erreur lors de la création de l’équipe");
      const newTeam: Team = await response.json();
      setTeams([...teams, newTeam]);
      toast.success("Succès", { description: "Équipe créée avec succès" });
    } catch (err) {
      toast.error("Erreur", { description: (err as Error).message });
    }
  };

  const handleEditTeam = async (teamData: Omit<Team, "id">) => {
    if (!editingTeam) return;

    try {
      const response = await fetch(`${API_URL}/api/teams/${editingTeam.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(teamData),
      });
      if (!response.ok) throw new Error("Erreur lors de la mise à jour de l’équipe");
      const updatedTeam: Team = await response.json();

      const oldTeamName = editingTeam.name;
      setTeams(teams.map((team) => (team.id === editingTeam.id ? updatedTeam : team)));

      // Si le nom a changé, mettre à jour les utilisateurs de cette équipe
      if (oldTeamName !== updatedTeam.name) {
        const updatedUsers = users.map((user) =>
          user.team.id === editingTeam.id ? { ...user, team: { ...user.team, name: updatedTeam.name } } : user
        );
        setUsers(updatedUsers);
      }

      toast.success("Succès", { description: "Équipe mise à jour avec succès" });
    } catch (err) {
      toast.error("Erreur", { description: (err as Error).message });
    }
  };

  const handleDeleteTeam = async () => {
    if (!deleteTeamId) return;

    try {
      const response = await fetch(`${API_URL}/api/teams/${deleteTeamId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Erreur lors de la suppression de l’équipe");

      // Trouver l'équipe supprimée
      const deletedTeam = teams.find((team) => team.id === deleteTeamId);
      if (deletedTeam) {
        // Mettre à jour les utilisateurs qui appartenaient à cette équipe en les déplaçant vers "Unassigned"
        const updatedUsers = users.map((user) =>
          user.team.id === deleteTeamId
            ? {
                ...user,
                teamId: 0,
                team: {
                  id: 0,
                  name: "Unassigned",
                  createdAt: new Date().toISOString(),
                },
              }
            : user
        );
        setUsers(updatedUsers);
      }

      // Supprimer l'équipe de la liste
      setTeams(teams.filter((team) => team.id !== deleteTeamId));
      toast.success("Succès", {
        description: 'Équipe supprimée avec succès. Les utilisateurs ont été déplacés vers "Unassigned".',
      });
      setDeleteTeamId(null);
    } catch (err) {
      toast.error("Erreur", { description: (err as Error).message });
    }
  };

  const getUserCount = (teamId: number) => {
    return users.filter((user) => user.team.id === teamId).length;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des équipes</h1>
          <p className="text-gray-600">Gérer les équipes et leurs membres</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une équipe
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Équipes</CardTitle>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher des équipes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <TeamsTable
            setDeleteTeamId={setDeleteTeamId}
            setEditingTeam={setEditingTeam}
            setIsModalOpen={setIsModalOpen}
            teams={filteredTeams}
            getUserCount={getUserCount}
          />
          <Pagination {...meta} onPageChange={onPageChange} dataName="Équipes" />
        </CardContent>
      </Card>

      <TeamModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTeam(null);
        }}
        onSubmit={editingTeam ? handleEditTeam : handleCreateTeam}
        team={editingTeam}
      />

      <DeleteConfirmDialog
        isOpen={!!deleteTeamId}
        onClose={() => setDeleteTeamId(null)}
        onConfirm={handleDeleteTeam}
        title="Supprimer l'équipe"
        description="Êtes-vous sûr de vouloir supprimer cette équipe ? Tous les utilisateurs de cette équipe seront déplacés vers 'Unassigned'."
      />
    </div>
  );
}
