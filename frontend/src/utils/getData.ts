import { APIResponse, APIErrorResponse, PaginationType } from "@/types";
import { isErrorResponse } from "./isErrorResponse";

// Effectue une requête GET vers l'API via le proxy
export async function getData<T>(url: string, meta?: PaginationType): Promise<APIResponse<T> | APIErrorResponse> {
  try {
    if (!url) {
      return { status: "error", message: "URL invalide", data: { code: "INVALID_URL" } };
    }

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    // Construire l'URL pour le proxy
    const proxyUrl = `/api/proxy/${url}${meta?.page ? `?page=${meta.page}` : ""}`;

    const response = await fetch(proxyUrl, {
      method: "GET",
      credentials: "include",
      headers,
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
export async function getDataSafe<T>(url: string, meta?: PaginationType): Promise<APIResponse<T>> {
  const response = await getData<T>(url, meta);
  if (isErrorResponse(response)) {
    throw new Error(`${response.message}${response.data?.code ? ` (${response.data.code})` : ""}`);
  }
  return response;
}
