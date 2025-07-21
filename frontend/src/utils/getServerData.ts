"use server";

import { cookies } from "next/headers";
import getBaseUrl from "./getBaseUrl";
import { APIErrorResponse, APIResponse, PaginationType } from "@/types";
import { isErrorResponse } from "./isErrorResponse";

export async function getServerData<T>(url: string, meta?: PaginationType): Promise<APIResponse<T> | APIErrorResponse> {
  try {
    if (!url) {
      return { status: "error", message: "URL invalide", data: { code: "INVALID_URL" } };
    }

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    const baseUrl = getBaseUrl();
    const query = meta?.page ? `?page=${meta.page}` : "";
    const apiUrl = `${baseUrl}/${url}/${query}`;

    const cookieStore = await cookies();
    const cookieHeader = cookieStore
      .getAll()
      .map(({ name, value }) => `${name}=${value}`)
      .join("; ");

    if (cookieHeader) {
      headers["cookie"] = cookieHeader;
    }

    const response = await fetch(apiUrl, {
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
export async function getServerDataSafe<T>(url: string, meta?: PaginationType): Promise<APIResponse<T>> {
  const response = await getServerData<T>(url, meta);
  if (isErrorResponse(response)) {
    throw new Error(`${response.message}${response.data?.code ? ` (${response.data.code})` : ""}`);
  }
  return response;
}
