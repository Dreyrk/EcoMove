import express from "express";
import statsController from "../controllers/stats.controller";
import authMiddleware from "../middlewares/auth.middleware";

const statsRouter = express.Router();

// GET Requests
statsRouter.get("/general", statsController.getGeneralStats);
statsRouter.get("/teams/rankings", statsController.getTeamRankings);
statsRouter.get("/users/rankings", statsController.getIndividualRankings);
statsRouter.get("/users/id/:id", authMiddleware.verifyToken, statsController.getUserStats);
statsRouter.get("/users/id/:id/progress", authMiddleware.verifyToken, statsController.getUserProgress);

export default statsRouter;
