import { PrismaClient } from "@prisma/client";

declare global {
  // Permet d'étendre globalThis pour stocker l'instance Prisma
  // Évite l'erreur de multiple instances en dev (hot reload)
  var prisma: PrismaClient | undefined;
}

const db =
  global.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = db;
}

export default db;
