import express from "express";
import activityController from "../controllers/activity.controller";
import authMiddleware from "../middlewares/auth.middleware";

const activityRouter = express.Router();

// GET Requests
activityRouter.get("/", activityController.getAllActivities);
activityRouter.get("/user/:userId", authMiddleware.verifyToken, activityController.getActivitiesByUserId);

// POST Requests
activityRouter.post("/new", activityController.createActivity);

// PUT Requests

// DELETE Requests
activityRouter.delete("/:id", authMiddleware.verifyToken, activityController.deleteActivity);

export default activityRouter;
