import { z } from "zod";

export const ActivityTypeSchema = z.enum(["VELO", "MARCHE"]);
export const ActivitySchema = z
  .object({
    id: z.number().optional(),
    userId: z.number(),
    date: z.date().max(new Date()),
    type: ActivityTypeSchema,
    distanceKm: z.number(),
    steps: z.number().optional(),
    createdAt: z.date().optional(),
  })
  .refine((data) => {
    if (data.type === "MARCHE" && data.steps) {
      data.distanceKm = data.steps / 1500;
    }
    return true;
  });
