import User from "../../models/user.model";

import WorkspaceMember from "../../models/workspaceMember.model";

import ProjectMember from "../../models/workspaceprojectMember.model";

import Project from "../../models/workspaceProject.model";

import { checkProjectAccess } from "../../utils/access/project.access";

import { checkProjectLeaderAccess } from "../../utils/access/project.leader.access";

export const getProjectDetails = async (
  userId: string,
  workspace_slug: string,
  project_slug: string,
) => {
  const { project } = await checkProjectAccess(
    userId,

    workspace_slug,

    project_slug,
  );

  return {
    project,
  };
};

export const getAllProjectMembers = async (
  userId: string,
  workspace_slug: string,
  project_slug: string,
) => {
  const { project } = await checkProjectAccess(
    userId,

    workspace_slug,

    project_slug,
  );

  const allMembers = await ProjectMember.find({
    project: project._id,
  }).populate("user", "first_name last_name email");

  return {
    allMembers,
  };
};

export const addMember = async (
  userId: string,
  workspace_slug: string,
  project_slug: string,
  user_email: string,
) => {
  const { workspace, project, isProjectOwner } = await checkProjectLeaderAccess(
    userId,

    workspace_slug,

    project_slug,
  );

  // target user
  const user = await User.findOne({
    email: user_email,
  });

  if (!user) {
    throw new Error("No such user found");
  }

  // workspace member check
  const isWorkspaceMember = await WorkspaceMember.findOne({
    workspace: workspace._id,

    user: user._id,
  });

  const isWorkspaceOwner =
    workspace.owner._id.toString() === user._id.toString();

  if (!isWorkspaceMember && !isWorkspaceOwner) {
    throw new Error("User is not member of workspace");
  }

  // already project member?
  const alreadyMember = await ProjectMember.findOne({
    project: project._id,

    user: user._id,
  });

  if (alreadyMember) {
    throw new Error("User already exists");
  }

  // create member
  const member = await ProjectMember.create({
    user: user._id,

    role: "leader",

    project: project._id,
  });

  return {
    member,
  };
};

export const updateProject = async (
  userId: string,
  workspace_slug: string,
  project_slug: string,
  data: {
    description?: string;
  },
) => {
  const { project } = await checkProjectLeaderAccess(
    userId,

    workspace_slug,

    project_slug,
  );

  // description only
  if (data.description) {
    project.description = data.description;
  }

  await project.save();

  return {
    project,
  };
};

export const deleteProject = async (
  userId: string,
  workspace_slug: string,
  project_slug: string,
) => {
  const { project } = await checkProjectLeaderAccess(
    userId,

    workspace_slug,

    project_slug,
  );

  // delete project members
  await ProjectMember.deleteMany({
    project: project._id,
  });

  // TODO:
  // delete tasks/comments later

  await Project.deleteOne({
    _id: project._id,
  });

  return {
    message: "Project deleted successfully",
  };
};

export const removeProjectMember = async (
  userId: string,
  workspace_slug: string,
  project_slug: string,
  memberId: string,
) => {
  const { project } = await checkProjectLeaderAccess(
    userId,

    workspace_slug,

    project_slug,
  );

  // prevent owner removal
  if (project.createdBy._id.toString() === memberId) {
    throw new Error("Project owner cannot be removed");
  }

  const member = await ProjectMember.findOne({
    project: project._id,

    user: memberId,
  });

  if (!member) {
    throw new Error("Member not found");
  }

  await ProjectMember.deleteOne({
    _id: member._id,
  });

  return {
    message: "Member removed successfully",
  };
};
