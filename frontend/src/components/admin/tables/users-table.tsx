"use client";

import { User } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import formatDateFr from "@/utils/formatDateFr";
import { Edit, Trash2 } from "lucide-react";

interface UsersTableProps {
  users: User[];
  setEditingUser: (user: User | null) => void;
  setIsModalOpen: (isModalOpen: boolean) => void;
  setDeleteUserId: (id: number | null) => void;
  sortField: keyof User | "team";
  sortDirection: "asc" | "desc";
  handleSort: (field: keyof User | "team") => void;
}

export default function UsersTable({
  users,
  setEditingUser,
  setIsModalOpen,
  setDeleteUserId,
  handleSort,
  sortField,
  sortDirection,
}: UsersTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead onClick={() => handleSort("id")} className="cursor-pointer hover:bg-gray-50">
            ID {sortField === "id" && (sortDirection === "asc" ? "↑" : "↓")}
          </TableHead>
          <TableHead onClick={() => handleSort("name")} className="cursor-pointer hover:bg-gray-50">
            Nom {sortField === "name" && (sortDirection === "asc" ? "↑" : "↓")}
          </TableHead>
          <TableHead onClick={() => handleSort("email")} className="cursor-pointer hover:bg-gray-50">
            Email {sortField === "email" && (sortDirection === "asc" ? "↑" : "↓")}
          </TableHead>
          <TableHead onClick={() => handleSort("team")} className="cursor-pointer hover:bg-gray-50">
            Équipe {sortField === "team" && (sortDirection === "asc" ? "↑" : "↓")}
          </TableHead>
          <TableHead onClick={() => handleSort("createdAt")} className="cursor-pointer hover:bg-gray-50">
            Créé le {sortField === "createdAt" && (sortDirection === "asc" ? "↑" : "↓")}
          </TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.id}</TableCell>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.team?.name || "Unassigned"}</TableCell>
            <TableCell>{user.createdAt ? formatDateFr(new Date(user.createdAt)) : "Non renseigné"}</TableCell>
            <TableCell className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditingUser(user);
                  setIsModalOpen(true);
                }}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="destructive" size="sm" onClick={() => setDeleteUserId(user.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
