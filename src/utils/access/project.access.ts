import Project from "../../models/workspaceProject.model";

import ProjectMember from "../../models/workspaceprojectMember.model";

import { checkWorkspaceAccess } from "./workspace.access";

export const checkProjectAccess = async (
  userId: string,
  workspace_slug: string,
  project_slug: string,
) => {
  // workspace access
  const { workspace } = await checkWorkspaceAccess(
    userId,

    workspace_slug,
  );

  // project
  const project = await Project.findOne({
    slug: project_slug,

    workspace: workspace._id,
  }).populate("createdBy", "first_name last_name email");

  if (!project) {
    throw new Error("Project not found");
  }

  // project membership
  const isProjectMember = await ProjectMember.findOne({
    project: project._id,

    user: userId,
  });

  const isProjectOwner = project.createdBy._id.toString() === userId;

  if (!isProjectMember && !isProjectOwner) {
    throw new Error("You are not part of project");
  }

  return {
    workspace,

    project,

    isProjectMember,

    isProjectOwner,
  };
};
