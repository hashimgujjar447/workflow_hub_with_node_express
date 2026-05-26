import { Router } from "express";
import taskRouter from "../task/task.routes";

import protect from "../../middleware/protect.middleware";

import {
  getProjectDetail,
  getProjectMembers,
  addMemberInProject,
  removeMemberFromProject,
  updateProjectInfo,
  removeProject,
} from "./project.controller";

const router = Router({
  mergeParams: true,
});

// project detail
router.get("/:project_slug", protect, getProjectDetail);

// project members
router.get("/:project_slug/members", protect, getProjectMembers);

// add member in project
router.post("/:project_slug/members", protect, addMemberInProject);

// remove member from project
router.delete(
  "/:project_slug/members/:memberId",
  protect,
  removeMemberFromProject,
);

// update project
router.patch("/:project_slug", protect, updateProjectInfo);

// delete project
router.delete("/:project_slug", protect, removeProject);

router.use("/:project_slug/tasks", taskRouter);

export default router;
