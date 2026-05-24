import { Router } from "express";

import {
  getAllWorkspaces,
  createWorkspaceProject,
  getAllWorkspacesProjects,
  getWorkspaceDetail,
  getWorkspaceMembers,
  addMemberInWorkspace,
  removeWorkspace,
  removeMemberFromWorkspace,
} from "./workspace.controller";

import protect from "../../middleware/protect.middleware";

const router = Router();

// 🔐 ALL ROUTES PROTECTED

// all workspaces
router.get("/", protect, getAllWorkspaces);

// workspace detail
router.get("/:slug", protect, getWorkspaceDetail);

// workspace members
router.get("/:slug/members", protect, getWorkspaceMembers);

// add member
router.post("/:slug/members", protect, addMemberInWorkspace);

// all workspace projects
router.get("/:slug/projects", protect, getAllWorkspacesProjects);

// create project
router.post("/:slug/projects", protect, createWorkspaceProject);

// remove member
router.delete("/:slug/members/:memberId", protect, removeMemberFromWorkspace);

// delete workspace
router.delete("/:slug", protect, removeWorkspace);

export default router;
