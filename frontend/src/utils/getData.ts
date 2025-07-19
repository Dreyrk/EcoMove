// Importation des types et utilitaires
import { APIResponse, APIErrorResponse } from "@/types";
import getBaseUrl from "./getBaseUrl";

// Vérifie si une réponse est une erreur
function isErrorResponse<T>(res: APIResponse<T> | APIErrorResponse): res is APIErrorResponse {
  return res.status === "error";
}

// Effectue une requête GET vers l'API
export async function getData<T>(url: string): Promise<APIResponse<T> | APIErrorResponse> {
  try {
    if (!url) {
      return { status: "error", message: "URL invalide", data: { code: "INVALID_URL" } };
    }

    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/${url}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      // Timeout de 10 secondes
      signal: AbortSignal.timeout(10000),
    });

    const json = await response.json();

    if (!response.ok) {
      return {
        status: "error",
        message: json.message ?? `Erreur HTTP: ${response.status}`,
        data: json.data ?? {
          code: response.status === 401 ? "UNAUTHORIZED" : response.status === 404 ? "NOT_FOUND" : "HTTP_ERROR",
        },
      };
    }

    if (json.status === "error") {
      return {
        status: "error",
        message: json.message ?? "Une erreur inconnue est survenue",
        data: json.data,
      };
    }

    return json as APIResponse<T>;
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Une erreur réseau est survenue",
      data: { code: error instanceof DOMException && error.name === "TimeoutError" ? "TIMEOUT" : "NETWORK_ERROR" },
    };
  }
}

// Effectue une requête GET avec garantie de réponse de succès
export async function getDataSafe<T>(url: string): Promise<APIResponse<T>> {
  const response = await getData<T>(url);

  if (isErrorResponse(response)) {
    throw new Error(`${response.message}${response.data?.code ? ` (${response.data.code})` : ""}`);
  }

  return response;
}
