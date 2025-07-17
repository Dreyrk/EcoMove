import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import activityRouter from "./routes/activity.routes";
import authRouter from "./routes/auth.routes";
import statsRouter from "./routes/stats.routes";
import { errorHandler } from "./middlewares/error.middleware";
import teamRouter from "./routes/team.routes";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/activities", activityRouter);
app.use("/api/team", teamRouter);
app.use("/api/stats", statsRouter);
app.use("/api/auth", authRouter);

app.use(errorHandler);

// Start server
app.listen(port, () => {
  console.log(`🚀 Server ready at http://localhost:${port}`);
});
