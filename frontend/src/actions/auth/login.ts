"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { FormState } from "@/types";
import { formatZodErrorToFormState } from "@/utils/formatZodErrorToFormState";
import { authFetcher } from "@/utils/authFetcher";

const loginSchema = z.object({
  email: z.email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

export type LoginFields = z.infer<typeof loginSchema>;

export default async function login(
  prevState: FormState<LoginFields>,
  formData: FormData
): Promise<FormState<LoginFields> & { token?: string }> {
  const data = Object.fromEntries(formData.entries());

  // Validation des données
  const result = loginSchema.safeParse(data);

  if (!result.success) {
    return formatZodErrorToFormState(result.error);
  }

  const res = await authFetcher("login", result.data);

  if (!res.success) {
    console.error("Échec de l'authentification:", res.message);
    return {
      success: false,
      errors: {
        email: [res.message || "Erreur lors de la connexion"],
      },
    };
  }

  if (res.token) {
    const cookieStore = await cookies();

    // Définir le cookie côté server
    cookieStore.set("token", res.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 jours
      path: "/",
    });
    return {
      success: true,
      token: res.token,
      errors: {},
    };
  } else {
    console.error("Token non trouvé dans les cookies");
    return {
      success: false,
      errors: { email: ["Pas de token trouvé"] },
    };
  }
}
