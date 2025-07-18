import express from "express";
import activityController from "../controllers/activity.controller";

const activityRouter = express.Router();

// GET Requests
activityRouter.get("/", activityController.getAllActivities);
activityRouter.get("/user/:userId", activityController.getActivitiesByUserId);

// POST Requests
activityRouter.post("/", activityController.createActivity);

// PUT Requests

// DELETE Requests
activityRouter.delete("/:id", activityController.deleteActivity);

export default activityRouter;
