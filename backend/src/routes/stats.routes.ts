// Importation des dépendances nécessaires
import express from "express";
import statsController from "../controllers/stats.controller";
import authMiddleware from "../middlewares/auth.middleware";

const statsRouter = express.Router();

// Routes publiques pour les statistiques globales et classements
statsRouter.get("/general", statsController.getGeneralStats); // GET /api/stats/general - Statistiques globales du challenge
statsRouter.get("/teams/rankings", statsController.getTeamRankings); // GET /api/stats/teams/rankings - Classement des équipes
statsRouter.get("/users/rankings", statsController.getIndividualRankings); // GET /api/stats/users/rankings - Classement individuel des utilisateurs

// Routes protégées pour les statistiques utilisateur
statsRouter.get("/users/:id", authMiddleware.verifyToken, statsController.getUserStats); // GET /api/stats/users/:id - Statistiques d’un utilisateur
statsRouter.get("/users/:id/progress", authMiddleware.verifyToken, statsController.getUserProgress); // GET /api/stats/users/:id/progress - Progression d’un utilisateur

export default statsRouter;
