"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { FormState } from "@/types";
import { formatZodErrorToFormState } from "@/utils/formatZodErrorToFormState";
import getBaseUrl from "@/utils/getBaseUrl";

const loginSchema = z.object({
  email: z.email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

export type LoginFields = z.infer<typeof loginSchema>;

export default async function login(
  prevState: FormState<LoginFields>,
  formData: FormData
): Promise<FormState<LoginFields>> {
  const data = Object.fromEntries(formData.entries());

  const result = loginSchema.safeParse(data);

  if (!result.success) {
    return formatZodErrorToFormState(result.error);
  }

  try {
    // authFetcher ne peut pas être utilisé ici car on doit gérer manuellement les cookies de la réponse
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(result.data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      return {
        success: false,
        errors: {
          email: [responseData.message || "Erreur lors de la connexion"],
        },
      };
    }

    const cookieStore = await cookies();

    // Récupérer les cookies depuis la réponse
    const setCookieHeader = response.headers.get("set-cookie");

    if (setCookieHeader) {
      // Parser le cookie token
      const tokenMatch = setCookieHeader.match(/token=([^;]+)/);
      if (tokenMatch) {
        const token = tokenMatch[1];

        // Définir le cookie côté Next.js
        cookieStore.set("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60, // 7 jours
          path: "/",
        });
      }
    }
    return { success: true, errors: {} };
  } catch (e) {
    console.error((e as Error).message);
    return {
      success: false,
      errors: {
        email: ["Erreur de connexion au serveur"],
      },
    };
  }
}
