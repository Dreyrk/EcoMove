import express from "express";
import teamController from "../controllers/team.controller";
import authMiddleware from "../middlewares/auth.middleware";

const teamRouter = express.Router();

// GET /api/teams - Récupère la liste de toutes les équipes
teamRouter.get("/", teamController.getAll);

// GET /api/teams/:id - Récupère une équipe spécifique par son ID
teamRouter.get("/:id", authMiddleware.verifyToken, teamController.getById);

// --- Routes de modification (réservées aux administrateurs) ---

// POST /api/teams - Crée une nouvelle équipe
teamRouter.post("/", authMiddleware.verifyToken, teamController.create);

// PUT /api/teams/:id - Met à jour une équipe existante
teamRouter.put("/:id", authMiddleware.verifyToken, teamController.update);

// DELETE /api/teams/:id - Supprime une équipe existante
teamRouter.delete("/:id", authMiddleware.verifyToken, teamController.delete);

export default teamRouter;
