import { Router } from "express";
import projectRouter from "../project/project.routes";

import {
  getAllWorkspaces,
  createWorkspaceProject,
  getAllWorkspacesProjects,
  getWorkspaceDetail,
  getWorkspaceMembers,
  addMemberInWorkspace,
  removeWorkspace,
  removeMemberFromWorkspace,
  createNewWorkspace,
} from "./workspace.controller";

import protect from "../../middleware/protect.middleware";

const router = Router();

// 🔐 ALL ROUTES PROTECTED

// create workspace
router.post("/", protect, createNewWorkspace);

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

// nested project routes
router.use("/:workspace_slug/projects", projectRouter);

export default router;
