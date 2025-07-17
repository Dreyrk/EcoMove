import { toast } from "sonner";
import { APIErrorResponse, APIResponse } from "@/types";
import getBaseUrl from "./getBaseUrl";

function isErrorResponse<T>(res: APIResponse<T> | APIErrorResponse): res is APIErrorResponse {
  return res.status === "error";
}

export async function getData<T>(url: string): Promise<APIResponse<T> | APIErrorResponse> {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/${url}`);

    const json = await res.json();

    if (!res.ok || json.status === "error") {
      return {
        status: "error",
        message: json.message ?? "Une erreur inconnue est survenue",
      };
    }

    return json as APIResponse<T>;
  } catch (e) {
    return {
      status: "error",
      message: e instanceof Error ? e.message : "Une erreur inconnue est survenue",
    };
  }
}

export async function getDataSafe<T>(url: string): Promise<APIResponse<T> | null> {
  const response = await getData<T>(url);

  if (isErrorResponse(response)) {
    toast.error(response.message);
    return null;
  }

  return response;
}
