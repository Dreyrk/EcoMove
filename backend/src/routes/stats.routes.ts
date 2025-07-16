import router from "../router";
import statsController from "../controllers/stats.controller";

const statsRouter = router;

// GET Requests
statsRouter.get("/general", statsController.getGeneralStats);
statsRouter.get("/teams/rankings", statsController.getTeamRankings);
statsRouter.get("/users/rankings", statsController.getIndividualRankings);
statsRouter.get("/users/id/:id", statsController.getUserStats);
statsRouter.get("/users/id/:id/progress", statsController.getUserProgress);

export default statsRouter;
