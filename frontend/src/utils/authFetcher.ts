import getBaseUrl from "./getBaseUrl";

type AuthMode = "login" | "register" | "logout";

interface AuthFormData {
  email: string;
  password: string;
  name?: string;
  teamId?: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  teamId: number;
}

interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    user?: User;
    token?: string;
  };
}

export async function authFetcher(
  mode: AuthMode,
  data?: AuthFormData
): Promise<AuthResponse & { token?: string | null }> {
  try {
    const baseUrl = getBaseUrl();
    const proxyUrl = `${baseUrl}/api/proxy/api/auth/${mode}`;

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    const fetchOptions: RequestInit = {
      method: "POST",
      headers,
      body: JSON.stringify(data),
      credentials: "include",
    };

    const res = await fetch(proxyUrl, fetchOptions);
    const resData = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: resData.message || resData.error || "Erreur inconnue",
      };
    }

    const setCookie = res.headers.get("set-cookie");

    if (setCookie) {
      const cookiesTokenMatch = setCookie.match(/token=([^;]+)/);

      if (cookiesTokenMatch && cookiesTokenMatch[1]) {
        const token = cookiesTokenMatch[1];
        return {
          success: true,
          data: resData.data || resData,
          token,
        };
      } else {
        return {
          success: false,
          message: "Pas de token dans les cookies",
        };
      }
    }
    return {
      success: false,
      message: "Pas de cookies",
    };
  } catch (e) {
    return {
      success: false,
      message: `Une erreur s'est produite: ${(e as Error).message}`,
    };
  }
}
