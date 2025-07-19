import { z } from "zod";

export const ActivityTypeSchema = z.enum(["VELO", "MARCHE"]);

const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;

export const ActivitySchema = z
  .object({
    id: z.number().optional(),
    userId: z.number({ error: "ID utilisateur requis" }).int().positive(),
    date: z.string().regex(dateRegex, { message: "La date doit être au format DD/MM/YYYY" }),
    type: ActivityTypeSchema,
    distanceKm: z.number({ error: "Distance requise" }).min(0, { message: "La distance doit être positive" }),
    steps: z.number({ error: "Nombre de pas requis pour MARCHE" }).int().positive().optional(),
  })
  .transform((data) => {
    if (data.type === "MARCHE" && data.steps) {
      return { ...data, distanceKm: parseFloat((data.steps / 1500).toFixed(1)) };
    }
    return data;
  })
  .refine(
    (data) => {
      if (data.type === "MARCHE" && !data.steps) {
        return false;
      }
      return true;
    },
    { message: "Le nombre de pas est requis pour une activité MARCHE", path: ["steps"] }
  );
