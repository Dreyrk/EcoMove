"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Team } from "@/types";

interface TeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (team: Omit<Team, "id">) => void;
  team?: Team | null;
}

export function TeamModal({ isOpen, onClose, onSubmit, team }: TeamModalProps) {
  const [formData, setFormData] = useState<Team>({
    name: "",
    description: "",
    id: team?.id ?? 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (team) {
      setFormData({
        name: team.name,
        description: team.description,
        id: team.id,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        id: 0,
      });
    }
    setErrors({});
  }, [team, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Team name is required";
    }

    if (!formData.description?.trim()) {
      newErrors.description = "Team description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        name: formData.name,
        description: formData.description,
      });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{team ? "Edit Team" : "Create New Team"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Team Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className={errors.description ? "border-red-500" : ""}
                rows={3}
              />
              {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{team ? "Update Team" : "Create Team"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
