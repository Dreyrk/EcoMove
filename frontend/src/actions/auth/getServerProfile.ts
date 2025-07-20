"use server";

import { cookies } from "next/headers";
import getBaseUrl from "@/utils/getBaseUrl";
import { User } from "@/components/providers/auth-provider";

export async function getServerSideProfile(): Promise<User | null> {
  const API_URL = getBaseUrl();

  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get("token");

    const headers: Record<string, string> = {};

    if (authCookie) {
      headers.Cookie = `${authCookie.name}=${authCookie.value}`;
    }

    const response = await fetch(`${API_URL}/api/auth/profile`, {
      headers: { "Content-Type": "application/json", ...headers },
      credentials: "include",
    });

    if (!response.ok) {
      console.warn("Profil utilisateur non trouvé ou authentification échouée.");
      return null;
    }

    const profileData = await response.json();
    return profileData.data as User;
  } catch (error) {
    console.error("Erreur lors de la récupération du profil :", error);
    return null;
  }
}
