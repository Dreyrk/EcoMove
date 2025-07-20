import { APIErrorResponse, APIResponse } from "@/types";

// Vérifie si une réponse est une erreur
export function isErrorResponse<T>(res: APIResponse<T> | APIErrorResponse): res is APIErrorResponse {
  return res.status === "error";
}
