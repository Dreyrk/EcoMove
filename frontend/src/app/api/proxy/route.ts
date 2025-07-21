// Dans une API Route (ex: /pages/api/proxy.ts)
import getBaseUrl from "@/utils/getBaseUrl";
import { NextApiRequest, NextApiResponse } from "next";
import { cookies } from "next/headers";

interface ProxyRequest extends NextApiRequest {
  query: {
    url?: string;
  };
}

export default async function handler(req: ProxyRequest, res: NextApiResponse) {
  // Extraire le token du cookie
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  // Vérifier si le token est présent
  if (!token) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  // Extraire l'URL de la requête
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  const baseUrl = getBaseUrl();

  try {
    // Faire la requête à l'API externe avec le token dans le header Authorization
    const response = await fetch(`${baseUrl}/${url}`, {
      method: req.method, // Utiliser la méthode HTTP de la requête entrante
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.value}`,
      },
      body: req.method !== "GET" ? JSON.stringify(req.body) : undefined, // Inclure le corps pour les méthodes autres que GET
      credentials: "include",
    });

    const data = await response.json();

    // Retourner la réponse de l'API externe au client
    return res.status(response.status).json(data);
  } catch (error) {
    // Gérer les erreurs
    return res.status(500).json({ error: (error as Error).message });
  }
}
