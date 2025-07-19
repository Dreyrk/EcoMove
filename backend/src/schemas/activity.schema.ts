import { z } from "zod";

export const ActivityTypeSchema = z.enum(["VELO", "MARCHE"]);

const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;

export const ActivitySchema = z
  .object({
    id: z.number().optional(),
    userId: z.number({ error: "ID Utilisateur manquant" }),
    date: z.string().regex(dateRegex, {
      message: "La date doit être au format DD/MM/YYYY",
    }),
    type: ActivityTypeSchema,
    distanceKm: z.number({ error: "Distance minimum requise" }).min(0),
    steps: z.number().optional(),
  })
  .refine((data) => {
    if (data.type === "MARCHE" && data.steps) {
      data.distanceKm = data.steps / 1500;
    }
    return true;
  });
