"use server";

import { z } from "zod";
import getBaseUrl from "@/utils/getBaseUrl";
import { formatZodErrorToFormState } from "@/utils/formatZodErrorToFormState";
import { revalidatePath } from "next/cache";
import { FormState } from "@/types";

const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;

const activitySchema = z
  .object({
    userId: z.coerce.number(),
    date: z.string().regex(dateRegex, "Date invalide"),
    type: z.enum(["VELO", "MARCHE"], { error: "Marche ou Vélo uniquement" }), // Utilisation de l'enum Prisma
    distanceKm: z.coerce.number().min(0, "La distance doit être positive").optional(),
    steps: z.coerce.number().min(0, "Le nombre de pas doit être positif").optional(),
  })
  .refine(
    (data) => {
      // Si c'est MARCHE, les pas sont obligatoires
      return data.type !== "MARCHE" || data.steps !== undefined;
    },
    {
      error: "Le nombre de pas est requis pour une activité de type MARCHE.",
      path: ["steps"],
    }
  )
  .refine(
    (data) => {
      // Si c'est VELO, la distance est obligatoire
      return data.type !== "VELO" || data.distanceKm !== undefined;
    },
    {
      error: "La distance est requise pour une activité de type VELO.",
      path: ["distanceKm"],
    }
  );

export type ActivityFields = z.infer<typeof activitySchema>;

export default async function submitActivity(
  prevState: FormState<ActivityFields>,
  formData: FormData
): Promise<FormState<ActivityFields>> {
  const raw = Object.fromEntries(formData.entries());

  const result = activitySchema.safeParse(raw);

  if (!result.success) {
    return formatZodErrorToFormState<ActivityFields>(result.error);
  }

  const { userId, date, type, distanceKm, steps } = result.data;

  try {
    // Préparation des données selon le type d'activité
    const activityData = {
      userId,
      date,
      type: type,
      distanceKm: Number(distanceKm),
      ...(type === "MARCHE" && {
        steps: Number(steps ?? 0),
      }),
    };

    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/activities/new`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(activityData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        errors: { date: [errorData.message || "Erreur lors de la création de l'activité"] },
      };
    }

    // Revalidation du cache pour actualiser les données
    revalidatePath("/activity/new");

    return {
      success: true,
      errors: {},
    };
  } catch (error) {
    return {
      success: false,
      errors: { date: [error instanceof Error ? error.message : "Une erreur inattendue s'est produite"] },
    };
  }
}
