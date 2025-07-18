import express from "express";
import teamController from "../controllers/team.controller";

const teamRouter = express.Router();

// GET Requests
teamRouter.get("/", teamController.getAllTeams);
teamRouter.get("/:id", teamController.getTeamById);

// POST Requests
teamRouter.post("/", teamController.createTeam);

// PUT Requests
teamRouter.put("/:id", teamController.updateTeam);

// DELETE Requests
teamRouter.delete("/:id", teamController.deleteTeam);

export default teamRouter;
