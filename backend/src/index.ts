import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import activityRouter from "./routes/activity.routes";
import authRouter from "./routes/auth.routes";
import authMiddleware from "./middlewares/auth.middleware";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/activities", authMiddleware.verifyToken, activityRouter);
app.use("/api/auth", authRouter);

// Start server
app.listen(port, () => {
  console.log(`🚀 Server ready at http://localhost:${port}`);
});
