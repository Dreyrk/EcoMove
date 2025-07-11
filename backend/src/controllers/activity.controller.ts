import { Request, Response } from "express";
import activityService from "../services/activity.service";

class ActivityController {
  async createActivity(req: Request, res: Response) {
    try {
      const { userId, date, type, steps, distanceKm } = req.body;
      const activity = await activityService.createActivity(userId, new Date(date), type, steps, distanceKm);
      res.status(201).json(activity);
    } catch (error) {
      res.status(500).json({ error: "Failed to create activity" });
    }
  }

  async getAllActivities(req: Request, res: Response) {
    try {
      const activities = await activityService.getAllActivities();
      res.status(200).json(activities);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve activities" });
    }
  }

  async getActivityById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const activity = await activityService.getActivityById(Number(id));
      if (activity) {
        res.status(200).json(activity);
      } else {
        res.status(404).json({ error: "Activity not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve activity" });
    }
  }

  async getActivitiesByUserId(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const activities = await activityService.getActivitiesByUserId(Number(userId));
      res.status(200).json(activities);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve user activities" });
    }
  }

  async updateActivity(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const activityData = req.body;
      const updatedActivity = await activityService.updateActivity(Number(id), activityData);
      res.status(200).json(updatedActivity);
    } catch (error) {
      res.status(500).json({ error: "Failed to update activity" });
    }
  }

  async deleteActivity(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await activityService.deleteActivity(Number(id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete activity" });
    }
  }
}

export default new ActivityController();
