export default function getBaseUrl(): string {
  // Côté client navigateur
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  // Environnement Docker ou prod back/API
  if (process.env.API_BASE_URL) {
    return process.env.API_BASE_URL;
  }
  // Variables NEXT_PUBLIC (utiles éventuellement côté client)
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }
  // Fallbacks
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}
