import express from "express";
import authController from "../controllers/auth.controller";
import authMiddleware from "../middlewares/auth.middleware";

const authRouter = express.Router();

// Routes GET
authRouter.get("/profile", authMiddleware.verifyToken, authController.getProfile); // GET /api/auth/profile - Récupère le profil de l'utilisateur authentifié

// Routes POST (méthodes d'authentification)
authRouter.post("/register", authController.register); // POST /api/auth/register - Crée un nouvel utilisateur
authRouter.post("/login", authController.login); // POST /api/auth/login - Connecte un utilisateur
authRouter.post("/logout", authMiddleware.verifyToken, authController.logout); // POST /api/auth/logout - Déconnecte l'utilisateur authentifié

export default authRouter;
