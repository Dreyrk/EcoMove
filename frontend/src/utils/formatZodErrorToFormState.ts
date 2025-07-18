/* eslint-disable @typescript-eslint/no-explicit-any */
import { flattenError, ZodError } from "zod";
import { FormState } from "@/types";

export function formatZodErrorToFormState<T extends Record<string, any>>(error: ZodError): FormState<T> {
  return {
    success: false,
    errors: flattenError(error).fieldErrors as FormState<T>["errors"],
  };
}
