import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  const { pathname } = request.nextUrl;

  // Si l'utilisateur est connecté et essaie d'accéder à la page de login
  if (token && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Si l'utilisateur n'est pas connecté et essaie d'accéder à une page protégée
  if (!token && pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Vérification pour la route /admin
  if (pathname.startsWith("/admin")) {
    try {
      // Décoder le token pour vérifier le rôle
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret-key");
      const { payload } = await jwtVerify(token as string, secret);

      // Vérifier si l'utilisateur a le rôle admin
      if (payload.role !== "ADMIN") {
        // Rediriger vers une page d'erreur ou la page d'accueil si non admin
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
      NextResponse.next();
    } catch (e) {
      console.error((e as Error).message);
      // En cas d'erreur (token invalide ou expiré), rediriger vers login
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Continuer pour les autres routes
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
