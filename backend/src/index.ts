import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import activityRouter from "./routes/activity.routes";
import authRouter from "./routes/auth.routes";
import statsRouter from "./routes/stats.routes";
import teamRouter from "./routes/team.routes";
import { errorHandler } from "./middlewares/error.middleware";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

const cors_origins = process.env.CORS_URLS?.split(",") || ["http://localhost:3000"];
// Middlewares
app.use(cors({ origin: cors_origins, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/teams", teamRouter);
app.use("/api/stats", statsRouter);
app.use("/api/activities", activityRouter);
app.use("/api/auth", authRouter);

app.use(errorHandler);

// Start server
app.listen(port, () => {
  console.log(`🚀 Server ready at http://localhost:${port}`);
});
