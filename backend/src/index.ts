import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import activityRouter from "./routes/activity.routes";
import authRouter from "./routes/auth.routes";
import statsRouter from "./routes/stats.routes";
import teamRouter from "./routes/team.routes";
import { errorHandler } from "./middlewares/error.middleware";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Configuration des origines CORS à partir de la variable d'environnement
const corsOrigins = process.env.CORS_URLS?.split(",").filter((origin) => origin.trim() !== "") || [
  "http://localhost:3000",
];

// Middlewares
app.use(cors({ origin: corsOrigins, credentials: true }));
app.use(express.json());
app.use(cookieParser());

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

// Middleware de gestion des erreurs
app.use(errorHandler);

// Start server
app.listen(port, () => {
  console.log(`🚀 Server ready at http://localhost:${port}`);
});
