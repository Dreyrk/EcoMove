import authController from "../controllers/auth.controller";
import router from "../router";

const authRouter = router;

// POST Requests (auth methods)
authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);

export default authRouter;
