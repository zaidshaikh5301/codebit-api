import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";

import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/users/user.routes.js";
import projectRoutes from "./modules/projects/project.routes.js";
import applicationRoutes from "./modules/applications/application.routes.js";
import taskRoutes from "./modules/tasks/task.routes.js";
import discussionRoutes from "./modules/discussions/discussion.routes.js";
import notificationRoutes from "./modules/notifications/notification.routes.js";
import githubRoutes from "./modules/github/github.routes.js";
import productivityRoutes from "./modules/productivity/productivity.routes.js";

import healthRoutes from "./routes/health.routes.js";

import { notFoundMiddleware } from "./middleware/notFound.middleware.js";

import { errorMiddleware } from "./middleware/error.middleware.js";

import {
  requestIdMiddleware,
  addRequestIdToResponse,
} from "./middleware/requestId.middleware.js";

import {
  authRateLimiter,
  apiRateLimiter,
  githubRateLimiter,
} from "./middleware/rateLimiter.middleware.js";

import { env } from "./config/env.js";
import { swaggerSpec } from "./config/swagger.js";

const app = express();

app.use(requestIdMiddleware);
app.use(addRequestIdToResponse);

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  }),
);

app.use(
  helmet({
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: env.nodeEnv === "production",
  }),
);

app.use(
  morgan(env.nodeEnv === "production" ? "combined" : "dev", {
    skip: (req) => req.url === "/api/health" || req.url === "/",
  }),
);

app.use(
  express.json({
    limit: "1mb",
  }),
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "1mb",
  }),
);

app.use(cookieParser());

app.use(apiRateLimiter);

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Codebit API",
  });
});

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/auth", authRateLimiter, authRoutes);

app.use("/api", userRoutes);

app.use("/api/projects", projectRoutes);

app.use("/api/applications", applicationRoutes);

app.use("/api/tasks", taskRoutes);

app.use("/api/discussions", discussionRoutes);

app.use("/api/notifications", notificationRoutes);

app.use("/api", githubRateLimiter, githubRoutes);

app.use("/api", productivityRoutes);

app.use("/api/health", healthRoutes);

app.use(notFoundMiddleware);

app.use(errorMiddleware);

export default app;
