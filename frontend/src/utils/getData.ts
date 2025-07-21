import { APIResponse, APIErrorResponse, PaginationType } from "@/types";
import getBaseUrl from "./getBaseUrl";
import { isErrorResponse } from "./isErrorResponse";

// Effectue une requête GET vers l'API via le proxy
export async function getData<T>(url: string, meta?: PaginationType): Promise<APIResponse<T> | APIErrorResponse> {
  try {
    // Validation de l'URL
    if (!url || typeof url !== "string" || url.trim() === "") {
      return {
        status: "error",
        message: "URL invalide",
        data: { code: "INVALID_URL" },
      };
    }

    // Construction de l'URL du proxy
    const baseUrl = getBaseUrl();
    const proxyPath = `/api/proxy/${url.replace(/^\/+/, "")}`; // Supprime les / initiaux
    const queryString = meta?.page ? `?page=${encodeURIComponent(meta.page)}` : "";
    const fullUrl = `${baseUrl}${proxyPath}${queryString}`;

    // Configuration des en-têtes
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    // Requête fetch via le proxy
    const response = await fetch(fullUrl, {
      method: "GET",
      credentials: "include", // Inclure les cookies pour l'authentification
      headers,
    });

    // Gestion de la réponse
    let json;
    try {
      json = await response.json();
    } catch {
      return {
        status: "error",
        message: "Réponse non-JSON de l'API",
        data: { code: "INVALID_RESPONSE" },
      };
    }

    // Gestion des erreurs HTTP
    if (!response.ok) {
      return {
        status: "error",
        message: json.message ?? `Erreur HTTP: ${response.status}`,
        data: json.data ?? {
          code: response.status === 401 ? "UNAUTHORIZED" : response.status === 404 ? "NOT_FOUND" : "HTTP_ERROR",
        },
      };
    }

    // Gestion des erreurs retournées par l'API
    if (json.status === "error") {
      return {
        status: "error",
        message: json.message ?? "Une erreur inconnue est survenue",
        data: json.data,
      };
    }

    return json as APIResponse<T>;
  } catch (error) {
    // Gestion des erreurs réseau ou inattendues
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Une erreur réseau est survenue",
      data: {
        code: error instanceof DOMException && error.name === "TimeoutError" ? "TIMEOUT" : "NETWORK_ERROR",
      },
    };
  }
}

// Effectue une requête GET avec garantie de réponse de succès
export async function getDataSafe<T>(url: string, meta?: PaginationType): Promise<APIResponse<T>> {
  const response = await getData<T>(url, meta);

  if (isErrorResponse(response)) {
    throw new Error(`${response.message}${response.data?.code ? ` (${response.data.code})` : ""}`);
  }

  return response;
}
