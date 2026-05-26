import express from "express";

import cors from "cors";

import cookieParser from "cookie-parser";

// routes
import authRouter from "./modules/auth/auth.routes";

import workspaceRouter from "./modules/workspace/workspace.routes";

import projectRouter from "./modules/project/project.routes";

import taskRouter from "./modules/task/task.routes";

import commentRouter from "./modules/comment/comment.routes";

const app = express();

// middlewares
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.use(express.json());

app.use(cookieParser());

// routes
app.use("/api/auth", authRouter);

app.use("/api/workspaces", workspaceRouter);

// health check
app.get("/", (req, res) => {
  res.json({
    success: true,

    message: "WorkflowHub API Running 🚀",
  });
});

// 404 route
app.use((req, res) => {
  return res.status(404).json({
    success: false,

    message: "Route not found",
  });
});

export default app;
