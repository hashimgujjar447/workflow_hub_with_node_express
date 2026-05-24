import { Router } from "express";

import protect from "../../middleware/protect.middleware";

import {
  getAllTasks,
  getTaskDetail,
  updateTask,
  removeTask,
} from "./task.controller";

const router = Router();

// all tasks
router.get("/:workspace_slug/:project_slug", protect, getAllTasks);

// single task detail
router.get("/:workspace_slug/:project_slug/:task_slug", protect, getTaskDetail);

// update task status
router.patch("/:workspace_slug/:project_slug/:task_slug", protect, updateTask);

// delete task
router.delete("/:workspace_slug/:project_slug/:task_slug", protect, removeTask);

export default router;
