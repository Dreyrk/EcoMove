"use client";

import { useState } from "react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { authFetcher } from "@/utils/authFetcher";
import { toast } from "sonner";

const registerSchema = z.object({
  name: z.string().min(2, "Nom requis"),
  email: z.email("Email invalide"),
  password: z.string().min(6, "6 caractères minimum"),
});

export default function RegisterForm({ onRegisterSuccess }: { onRegisterSuccess: () => void }) {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [formErrors, setFormErrors] = useState<{ name?: string; email?: string; password?: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    const result = registerSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors = z.flattenError(result.error).fieldErrors;
      setFormErrors({
        name: fieldErrors.name?.[0],
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      });
      return;
    }

    const { success, message } = await authFetcher("register", formData);

    if (!success) {
      toast.error(message);
      return;
    } else {
      toast.success("Inscription réussie !");
      onRegisterSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nom</Label>
        <Input id="name" name="name" value={formData.name} onChange={handleChange} />
        {formErrors.name && <p className="text-sm text-red-600">{formErrors.name}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" value={formData.email} onChange={handleChange} />
        {formErrors.email && <p className="text-sm text-red-600">{formErrors.email}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe</Label>
        <Input id="password" name="password" type="password" value={formData.password} onChange={handleChange} />
        {formErrors.password && <p className="text-sm text-red-600">{formErrors.password}</p>}
      </div>

      <Button type="submit" className="w-full">
        S’inscrire
      </Button>
    </form>
  );
}
