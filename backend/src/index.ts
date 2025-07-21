import express from "express";
import http from "http";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import activityRouter from "./routes/activity.routes";
import authRouter from "./routes/auth.routes";
import statsRouter from "./routes/stats.routes";
import teamRouter from "./routes/team.routes";
import { errorHandler } from "./middlewares/error.middleware";
import adminRouter from "./routes/admin.routes";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Configuration des origines CORS à partir de la variable d'environnement
const corsOrigins = process.env.CORS_URLS?.split(",").filter((origin) => origin.trim() !== "") || [
  "http://localhost:3000",
  "https://mobility-challenge.vercel.app",
];

// Middlewares
app.use(cors({ origin: corsOrigins, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

// Route racine pour vérifier l'état de l'API
app.get("/", (_req, res) => {
  res.status(200).json({
    status: "success",
    message: "API du Challenge Mobilité est en ligne",
  });
});

// Routes principales de l'API
app.use("/api/teams", teamRouter); // Gestion des équipes
app.use("/api/stats", statsRouter); // Statistiques et classements
app.use("/api/activities", activityRouter); // Gestion des activités
app.use("/api/auth", authRouter); // Authentification des utilisateurs
app.use("/api/admin", adminRouter); // Administration

// Middleware de gestion des erreurs
app.use(errorHandler);

// Cela empêche le serveur de démarrer lorsque l'application est importée (par exemple, par Supertest).
if (require.main === module) {
  const server = http.createServer(app).listen(port, () => {
    console.log(`🚀 Server ready at port ${port}`);
  });

  // Gestion de l'arrêt gracieux du serveur
  process.on("SIGTERM", () => {
    console.log("SIGTERM signal received: closing HTTP server");
    server.close(() => {
      console.log("HTTP server closed.");
    });
  });

  // En cas d'erreurs non gérées
  process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
    // Arrêter le processus pour éviter un état non stable
    server.close(() => {
      process.exit(1);
    });
  });

  process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception:", error);
    // Arrêter le processus pour éviter un état non stable
    server.close(() => {
      process.exit(1);
    });
  });
}

export default app;
