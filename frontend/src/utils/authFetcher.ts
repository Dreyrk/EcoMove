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
    code?: string;
    user?: User;
    token?: string;
  };
}

export async function authFetcher(mode: AuthMode, data?: AuthFormData): Promise<AuthResponse> {
  try {
    // Validation du mode
    if (!["login", "register", "logout"].includes(mode)) {
      return {
        success: false,
        message: "Mode d'authentification invalide",
        data: { code: "INVALID_MODE" },
      };
    }

    // Validation des données pour login/register
    if ((mode === "login" || mode === "register") && (!data || !data.email || !data.password)) {
      return {
        success: false,
        message: "Données d'authentification incomplètes",
        data: { code: "MISSING_DATA" },
      };
    }

    // Construction de l'URL du proxy
    const baseUrl = getBaseUrl();
    if (!baseUrl) {
      return {
        success: false,
        message: "URL de base invalide",
        data: { code: "INVALID_BASE_URL" },
      };
    }
    const proxyPath = `/api/proxy/auth/${mode}`;
    const fullUrl = `${baseUrl}${proxyPath}`;

    // Configuration des en-têtes
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    // Requête fetch via le proxy
    const response = await fetch(fullUrl, {
      method: "POST",
      headers,
      credentials: "include", // Inclure les cookies pour l'authentification
      body: data ? JSON.stringify(data) : undefined,
    });

    // Gestion de la réponse
    let resData;
    try {
      resData = await response.json();
    } catch {
      return {
        success: false,
        message: "Réponse non-JSON de l'API",
        data: { code: "INVALID_RESPONSE" },
      };
    }

    // Gestion des erreurs HTTP
    if (!response.ok) {
      return {
        success: false,
        message: resData.message || resData.error || `Erreur HTTP: ${response.status}`,
        data: {
          code: response.status === 401 ? "UNAUTHORIZED" : response.status === 404 ? "NOT_FOUND" : "HTTP_ERROR",
        },
      };
    }

    // Retourner la réponse en cas de succès
    return {
      success: true,
      data: resData.data || resData,
    };
  } catch (error) {
    // Gestion des erreurs réseau ou inattendues
    return {
      success: false,
      message: error instanceof Error ? error.message : "Une erreur réseau est survenue",
      data: {
        code: error instanceof DOMException && error.name === "TimeoutError" ? "TIMEOUT" : "NETWORK_ERROR",
      },
    };
  }
}
