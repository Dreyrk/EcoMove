import express from "express";
import authMiddleware from "../middlewares/auth.middleware";
import adminController from "../controllers/admin.controller";

const adminRouter = express.Router();

// GET Requests
adminRouter.get("/users", authMiddleware.verifyToken, authMiddleware.restrictToAdmin, adminController.getAllUsers);
adminRouter.get("/teams", authMiddleware.verifyToken, authMiddleware.restrictToAdmin, adminController.getAllTeams);
adminRouter.get(
  "/activities",
  authMiddleware.verifyToken,
  authMiddleware.restrictToAdmin,
  adminController.getAllActivities
);

// POST Requests
adminRouter.post(
  "/user/create",
  authMiddleware.verifyToken,
  authMiddleware.restrictToAdmin,
  adminController.createUser
);
adminRouter.post(
  "/team/create",
  authMiddleware.verifyToken,
  authMiddleware.restrictToAdmin,
  adminController.createTeam
);
adminRouter.post(
  "/activity/create",
  authMiddleware.verifyToken,
  authMiddleware.restrictToAdmin,
  adminController.createActivity
);

// PUT Requests
adminRouter.put("/user/:id", authMiddleware.verifyToken, authMiddleware.restrictToAdmin, adminController.updateUser);
adminRouter.put("/team/:id", authMiddleware.verifyToken, authMiddleware.restrictToAdmin, adminController.updateTeam);
adminRouter.put(
  "/activity/:id",
  authMiddleware.verifyToken,
  authMiddleware.restrictToAdmin,
  adminController.updateActivity
);

// DELETE Requests
adminRouter.delete("/user/:id", authMiddleware.verifyToken, authMiddleware.restrictToAdmin, adminController.deleteUser);
adminRouter.delete("/team/:id", authMiddleware.verifyToken, authMiddleware.restrictToAdmin, adminController.deleteTeam);
adminRouter.delete(
  "/activity/:id",
  authMiddleware.verifyToken,
  authMiddleware.restrictToAdmin,
  adminController.deleteActivity
);

export default adminRouter;
