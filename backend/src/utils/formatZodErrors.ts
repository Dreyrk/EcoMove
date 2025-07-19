import { flattenError, ZodError } from "zod";

// Formate les erreurs de validation Zod en un tableau de chaînes lisibles
export function formatZodErrors(error: ZodError): string[] {
  const fieldErrors = flattenError(error).fieldErrors;

  return Object.entries(fieldErrors)
    .filter(([_, messages]) => Array.isArray(messages) && messages.length > 0)
    .map(([field, messages]) => `${field}: ${(messages as string[]).join(", ")}`);
}
