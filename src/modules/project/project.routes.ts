import { Router } from "express";

import protect from "../../middleware/protect.middleware";

import {
  getProjectDetail,
  getProjectMembers,
  addMemberInProject,
  removeMemberFromProject,
  updateProjectInfo,
  removeProject,
} from "./project.controller";

const router = Router();

// project detail
router.get("/:workspace_slug/:project_slug", protect, getProjectDetail);

// project members
router.get(
  "/:workspace_slug/:project_slug/members",
  protect,
  getProjectMembers,
);

// add member in project
router.post(
  "/:workspace_slug/:project_slug/members",
  protect,
  addMemberInProject,
);

// remove member from project
router.delete(
  "/:workspace_slug/:project_slug/members/:memberId",
  protect,
  removeMemberFromProject,
);

// update project
router.patch("/:workspace_slug/:project_slug", protect, updateProjectInfo);

// delete project
router.delete("/:workspace_slug/:project_slug", protect, removeProject);

export default router;
