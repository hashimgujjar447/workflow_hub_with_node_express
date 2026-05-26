import { Router } from "express";

import protect from "../../middleware/protect.middleware";
import commentRouter from "../comment/comment.routes";

import {
  getAllTasks,
  getTaskDetail,
  updateTask,
  removeTask,
} from "./task.controller";

const router = Router({
  mergeParams: true,
});

// all tasks
router.get("/", protect, getAllTasks);

// single task detail
router.get("/:task_slug", protect, getTaskDetail);

// update task status
router.patch("/:task_slug", protect, updateTask);

// delete task
router.delete("/:task_slug", protect, removeTask);

router.use("/:task_slug/comments", commentRouter);

export default router;
