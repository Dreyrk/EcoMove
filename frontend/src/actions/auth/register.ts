"use server";

import { z } from "zod";
import { authFetcher } from "@/utils/authFetcher";
import { FormState } from "@/types";
import { formatZodErrorToFormState } from "@/utils/formatZodErrorToFormState";

const registerSchema = z.object({
  name: z.string().min(2, "Nom requis"),
  email: z.email("Email invalide"),
  password: z.string().min(8, "8 caractères minimum"),
  teamId: z.string().min(1, "Équipe requise"),
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

  try {
    const response = await authFetcher("register", result.data);

    console.log(response);

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
