import activityController from "../controllers/activity.controller";
import router from "../router";

const activityRouter = router;

// GET Requests
activityRouter.get("/", activityController.getAllActivities);
activityRouter.get("/:id", activityController.getActivityById);
activityRouter.get("/user/:userId", activityController.getActivityById);

// POST Requests
activityRouter.post("/", activityController.createActivity);

// PUT Requests
activityRouter.put("/:id", activityController.updateActivity);

// DELETE Requests
activityRouter.delete("/:id", activityController.deleteActivity);

export default activityRouter;
