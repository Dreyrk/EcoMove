import activityController from "../controllers/activity.controller";
import router from "../router";

const activityRouter = router;

// GET Requests
activityRouter.get("/", activityController.getAllActivities);
activityRouter.get("/user/:userId", activityController.getActivitiesByUserId);

// POST Requests
activityRouter.post("/", activityController.createActivity);

// PUT Requests

// DELETE Requests
activityRouter.delete("/:id", activityController.deleteActivity);

export default activityRouter;
