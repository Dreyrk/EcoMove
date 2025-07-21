import getBaseUrl from "@/utils/getBaseUrl";
import { NextRequest, NextResponse } from "next/server";

// Gestionnaire pour toutes les méthodes HTTP
export async function GET(req: NextRequest) {
  return handleRequest(req);
}

export async function POST(req: NextRequest) {
  return handleRequest(req);
}

export async function PUT(req: NextRequest) {
  return handleRequest(req);
}

export async function DELETE(req: NextRequest) {
  return handleRequest(req);
}

async function handleRequest(req: NextRequest) {
  // Extraire le chemin de l'URL après /api/proxy/
  const path = req.nextUrl.pathname.replace("/api/proxy/", "");
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/${path}`;

  try {
    // Préparer les en-têtes en supprimant ceux qui pourraient causer des problèmes
    const headers = new Headers(req.headers);
    headers.delete("host");
    headers.delete("origin");
    headers.delete("referer");

    // Effectuer la requête vers l'API externe
    const response = await fetch(url, {
      method: req.method,
      headers: headers,
      body: req.method !== "GET" && req.method !== "HEAD" ? await req.text() : undefined,
      credentials: "include",
    });

    // Convertir la réponse en JSON ou texte selon le type de contenu
    const contentType = response.headers.get("content-type") || "";
    const data = contentType.includes("application/json") ? await response.json() : await response.text();

    // Créer une nouvelle réponse avec les en-têtes de l'API externe
    const nextResponse = new NextResponse(JSON.stringify(data), {
      status: response.status,
      headers: response.headers,
    });

    return nextResponse;
  } catch (error) {
    console.error("Erreur lors de la requête à l'API externe:", error);
    return NextResponse.json({ error: "Erreur lors de la requête à l'API externe" }, { status: 500 });
  }
}
