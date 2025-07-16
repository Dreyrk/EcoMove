import { z } from "zod";

export const TeamSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  description: z.string().optional(),
});
