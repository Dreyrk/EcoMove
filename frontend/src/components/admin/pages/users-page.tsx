"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search } from "lucide-react";
import { UserModal } from "@/components/admin/user-modal";
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";
import { toast } from "sonner";
import getBaseUrl from "@/utils/getBaseUrl";
import { User } from "@/components/providers/auth-provider";
import { PaginationType, Team } from "@/types";
import UsersTable from "../tables/users-table";
import { Pagination } from "../tables/pagination";

export type PartialUser = Omit<User, "id">;

interface UsersPageProps {
  users: User[];
  setUsers: (users: User[]) => void;
  teams: Team[];
  meta: PaginationType;
  onPageChange: (page: number) => void;
}

export function UsersPage({ users, setUsers, teams, meta, onPageChange }: UsersPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof User | "team">("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);

  const baseUrl = getBaseUrl();

  const filteredUsers = users
    .filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.team?.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = sortField === "team" ? a.team?.name ?? "" : a[sortField] ?? "";
      const bValue = sortField === "team" ? b.team?.name ?? "" : b[sortField] ?? "";

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

  const handleSort = (field: keyof User | "team") => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleCreateUser = async (userData: PartialUser) => {
    try {
      const response = await fetch(`${baseUrl}/api/admin/user/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
        credentials: "include",
      });

      if (!response.ok) throw new Error("Erreur lors de la création de l’utilisateur");

      const newUser: User = await response.json();

      // Associer la team complète à newUser si possible
      if (newUser.team.id) {
        const fullTeam = teams.find((t) => t.id === newUser.team.id);
        if (fullTeam) {
          newUser.team = { id: fullTeam.id, name: fullTeam.name };
        }
      }

      setUsers([...users, newUser]);
      toast.success("Succès", { description: "Utilisateur créé avec succès" });
    } catch {
      toast.error("Erreur", { description: "Impossible de créer l’utilisateur" });
    }
  };

  const handleEditUser = async (userData: PartialUser) => {
    if (!editingUser) return;
    try {
      const response = await fetch(`${baseUrl}/api/admin/user/${editingUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
        credentials: "include",
      });

      if (!response.ok) throw new Error("Erreur lors de la mise à jour de l’utilisateur");

      const updatedUser: User = await response.json();

      // Associer la team complète à updatedUser si possible
      if (updatedUser.team.id) {
        const fullTeam = teams.find((t) => t.id === updatedUser.team.id);
        if (fullTeam) {
          updatedUser.team = { id: fullTeam.id, name: fullTeam.name };
        }
      }

      setUsers(users.map((u) => (u.id === editingUser.id ? updatedUser : u)));
      toast.success("Succès", { description: "Utilisateur mis à jour avec succès" });
    } catch {
      toast.error("Erreur", { description: "Impossible de mettre à jour l’utilisateur" });
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteUserId) return;
    try {
      const response = await fetch(`${baseUrl}/api/admin/user/${deleteUserId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Erreur lors de la suppression de l’utilisateur");

      setUsers(users.filter((u) => u.id !== deleteUserId));
      toast.success("Succès", { description: "Utilisateur supprimé avec succès" });
      setDeleteUserId(null);
    } catch {
      toast.error("Erreur", { description: "Impossible de supprimer l’utilisateur" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des utilisateurs</h1>
          <p className="text-gray-600">Gérer les utilisateurs du système et leurs équipes</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un utilisateur
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Utilisateurs</CardTitle>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher des utilisateurs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <UsersTable
            users={filteredUsers}
            handleSort={handleSort}
            setDeleteUserId={setDeleteUserId}
            setEditingUser={setEditingUser}
            setIsModalOpen={setIsModalOpen}
            sortDirection={sortDirection}
            sortField={sortField}
          />
          <Pagination {...meta} onPageChange={onPageChange} dataName="Utilisateurs" />
        </CardContent>
      </Card>

      <UserModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingUser(null);
        }}
        onSubmit={editingUser ? handleEditUser : handleCreateUser}
        user={editingUser}
        teams={teams}
      />

      <DeleteConfirmDialog
        isOpen={!!deleteUserId}
        onClose={() => setDeleteUserId(null)}
        onConfirm={handleDeleteUser}
        title="Supprimer l'utilisateur"
        description="Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible."
      />
    </div>
  );
}
