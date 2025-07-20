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

export async function authFetcher(mode: AuthMode, data?: AuthFormData): Promise<AuthResponse> {
  try {
    console.log("test");
    const baseUrl = getBaseUrl();

    if (!baseUrl) {
      return { success: false, message: "URL invalide" };
    }

    const res = await fetch(`${baseUrl}/api/auth/${mode}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Pour recevoir et envoyer les cookies
      body: JSON.stringify(data),
    });
    const resData = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: resData.message || resData.error || "Erreur inconnue",
      };
    }

    return {
      success: true,
      data: resData.data || resData,
    };
  } catch (e) {
    return {
      success: false,
      message: `Une erreur s'est produite: ${(e as Error).message}`,
    };
  }
}
