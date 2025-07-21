/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import { z } from "zod";
import { authFetcher } from "@/utils/authFetcher";
import { FormState } from "@/types";
import { formatZodErrorToFormState } from "@/utils/formatZodErrorToFormState";

const registerSchema = z
  .object({
    name: z.string().min(2, "Nom requis"),
    email: z.email("Email invalide"),
    password: z.string().min(8, "8 caractères minimum"),
    confirmPassword: z.string().min(8, "8 caractères minimum"),
    teamId: z.string().min(1, "Équipe requise"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Confirmez votre mot de passe",
    path: ["confirmPassword"],
  });

export type RegisterFields = z.infer<typeof registerSchema>;

export default async function register(
  prevState: FormState<RegisterFields>,
  formData: FormData
): Promise<FormState<RegisterFields>> {
  const data = Object.fromEntries(formData.entries());

  const result = registerSchema.safeParse(data);

  if (!result.success) {
    return formatZodErrorToFormState(result.error);
  }

  const { confirmPassword, ...registrationData } = result.data;

  try {
    const response = await authFetcher("register", registrationData);

    if (!response.success) {
      return {
        success: false,
        errors: {
          email: [response.message ?? "Erreur lors de l'inscription"],
        },
      };
    }

    return {
      success: true,
      errors: {},
    };
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
