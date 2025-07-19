import express from "express";
import activityController from "../controllers/activity.controller";
import authMiddleware from "../middlewares/auth.middleware";

const activityRouter = express.Router();

// Routes GET
activityRouter.get("/", activityController.getAllActivities); // GET /api/activities - Récupère toutes les activités (public)
activityRouter.get("/user/:userId", authMiddleware.verifyToken, activityController.getActivitiesByUserId); // GET /api/activities/user/:userId - Récupère les activités d'un utilisateur (authentifié)

// Routes POST
activityRouter.post("/new", authMiddleware.verifyToken, activityController.createActivity); // POST /api/activities/new - Crée une nouvelle activité (authentifié)

// Routes DELETE
activityRouter.delete("/:id", authMiddleware.verifyToken, activityController.deleteActivity); // DELETE /api/activities/:id - Supprime une activité (authentifié)

export default activityRouter;
