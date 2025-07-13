import router from "../router";
import statsController from "../controllers/stats.controller";

const statsRouter = router;

// GET Requests
statsRouter.get("/general", statsController.getGeneralStats);
statsRouter.get("/teams", statsController.getTeamStats);
statsRouter.get("/users", statsController.getUserStats);

export default statsRouter;
