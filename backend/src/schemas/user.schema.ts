import { z } from "zod";

export const UserRoleTypeSchema = z.enum(["USER", "ADMIN"]).default("USER");

export const UserSchema = z.object({
  name: z.string().min(1, { message: "Le nom est requis" }),
  email: z.email({ message: "Email invalide" }),
  password: z.string().min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" }),
  teamId: z.number().int().positive({ message: "Une équipe est requise pour s'inscrire" }),
  role: UserRoleTypeSchema,
});
