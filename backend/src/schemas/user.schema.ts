import { z } from "zod";

export const UserRoleTypeSchema = z.enum(["USER", "ADMIN"]);
export const UserSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  email: z.email(),
  password: z.string().min(8),
  teamId: z.number(),
  role: UserRoleTypeSchema,
  createdAt: z.date().optional(),
});
