"use client";

import { useEffect, useRef } from "react";
import { useActionState } from "react";
import login, { LoginFields } from "@/actions/auth/login";
import { FormState } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PasswordInput from "../ui/password-input";
import SubmitButton from "../ui/submit-button";
import { useAuth } from "../providers/auth-provider";

const initialState: FormState<LoginFields> & { token?: string } = {
  success: false,
  errors: {},
};

export default function LoginForm({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const [state, formAction, isPending] = useActionState(login, initialState);
  const { getProfile } = useAuth();

  // Utilisation de la ref pour éviter le rerender
  const calledRef = useRef(false);

  useEffect(() => {
    const fetchProfile = async () => {
      await getProfile();
    };

    if (state.success && !calledRef.current) {
      calledRef.current = true;

      fetchProfile();

      onLoginSuccess();
    }
  }, [state.success, onLoginSuccess, getProfile]);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" placeholder="Entrer votre email" />
        {state.errors?.email && <p className="text-sm text-red-600">{state.errors.email.join(",")}</p>}
      </div>

      <div className="space-y-2">
        <PasswordInput id="password" name="password" placeholder="Entrer votre mot de passe" />
        {state.errors?.password && <p className="text-sm text-red-600">{state.errors.password.join(",")}</p>}
      </div>

      <SubmitButton isPending={isPending} pendingText="Connexion en cours..." text="Se connecter" />
    </form>
  );
}
