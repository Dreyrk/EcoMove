import authController from "../controllers/auth.controller";
import authMiddleware from "../middlewares/auth.middleware";
import router from "../router";

const authRouter = router;

// GET Requests
authRouter.get("/profile", authMiddleware.verifyToken, authController.getProfile);

// POST Requests (auth methods)
authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.post("/logout", authController.logout);

export default authRouter;
