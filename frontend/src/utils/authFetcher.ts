import getBaseUrl from "./getBaseUrl";

type AuthMode = "login" | "register";

interface AuthFormData {
  email: string;
  password: string;
  name?: string;
}

export async function authFetcher(mode: AuthMode, data: AuthFormData): Promise<{ success: boolean; message?: string }> {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/api/auth/${mode}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return { success: false, message: errorData.message || "Erreur inconnue" };
    }

    return { success: true };
  } catch (e) {
    return { success: false, message: `Une erreur s'est produite: ${(e as Error).message}` };
  }
}
