export default function getBaseUrl(): string {
  // En développement
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }

  // En production, essayer différentes sources pour l'URL
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }

  // Côté client, utiliser l'origine actuelle
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  // Fallback pour les headers de requête (middleware, API routes)
  if (process.env.HOST) {
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    return `${protocol}://${process.env.HOST}`;
  }

  // Dernier fallback
  return "http://localhost:3000";
}
