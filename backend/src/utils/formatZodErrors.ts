import { flattenError, ZodError } from "zod";

export function formatZodErrors(error: ZodError): string[] {
  const fieldErrors = flattenError(error).fieldErrors;

  return Object.entries(fieldErrors)
    .filter(([_, messages]) => messages && messages.toString().length > 0)
    .map(([field, messages]) => `${field}: ${(messages as string[]).join(", ")}`);
}
