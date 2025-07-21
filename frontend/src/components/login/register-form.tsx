"use client";

import { useEffect, useRef, useState } from "react";
import { useActionState } from "react";
import register, { RegisterFields } from "@/actions/auth/register";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "sonner";
import { getDataSafe } from "@/utils/getData";
import { FormState, TeamType } from "@/types";
import PasswordInput from "../ui/password-input";
import SubmitButton from "../ui/submit-button";

const initialState: FormState<RegisterFields> = {
  success: false,
  errors: {},
};

export default function RegisterForm({ onRegisterSuccess }: { onRegisterSuccess: () => void }) {
  const [state, formAction, isPending] = useActionState(register, initialState);
  const [teams, setTeams] = useState<TeamType[]>([]);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await getDataSafe<TeamType[]>("api/teams/");
        setTeams(res.data as TeamType[]);
      } catch (e) {
        toast.error("Erreur lors du chargement des équipes.", { description: (e as Error).message });
      }
    };
    fetchTeams();
  }, []);

  // Utilisation de la ref pour éviter le rerender
  const calledRef = useRef(false);

  useEffect(() => {
    if (state.success && !calledRef.current) {
      calledRef.current = true;
      onRegisterSuccess();
    }
  }, [state.success, onRegisterSuccess]);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nom</Label>
        <Input name="name" id="name" />
        {state.errors?.name && <p className="text-sm text-red-600">{state.errors.name.join(",")}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input name="email" id="email" type="email" />
        {state.errors?.email && <p className="text-sm text-red-600">{state.errors.email.join(",")}</p>}
      </div>

      <div className="space-y-2">
        <PasswordInput name="password" id="password" />
        {state.errors?.password && <p className="text-sm text-red-600">{state.errors.password.join(",")}</p>}
      </div>
      <div className="space-y-2">
        <PasswordInput name="confirmPassword" id="confirmPassword" text="Confirmez votre mot de passe" />
        {state.errors?.confirmPassword && (
          <p className="text-sm text-red-600">{state.errors.confirmPassword.join(",")}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Équipe</Label>
        <Select name="teamId">
          <SelectTrigger>
            <SelectValue placeholder="Choisissez une équipe" />
          </SelectTrigger>
          <SelectContent>
            {teams.map((team) => (
              <SelectItem key={team.id} value={String(team.id)}>
                {team.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {state.errors?.teamId && <p className="text-sm text-red-600">{state.errors.teamId.join(",")}</p>}
      </div>

      <SubmitButton isPending={isPending} text="S’inscrire" pendingText="Inscription..." />
    </form>
  );
}
