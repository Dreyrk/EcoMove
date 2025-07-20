export default function getBaseUrl() {
  if (typeof window !== "undefined") {
    // Côté client (navigateur), utiliser la variable d'env ou localhost par défaut
    return process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";
  } else {
    // Côté serveur (SSR)
    if (process.env.NODE_ENV === "production") {
      // En production, utiliser la vraie URL backend publique (à définir en variable d'env)
      return process.env.API_BASE_URL ?? "";
    } else {
      // En dev, côté serveur, on peut accéder au backend via Docker network
      return "http://backend:4000";
    }
  }
}
