import { describe } from "zod/v4/core";
import User from "../../models/user.model";
import Workspace from "../../models/workspace.model";

import WorkspaceMember from "../../models/workspaceMember.model";
import Project from "../../models/workspaceProject.model";
import { IProject } from "../../models/workspaceProject.model";
import { checkWorkspaceAccess } from "../../utils/access/workspace.access";

export const createWorkspace = async (
  userId: string,
  data: {
    name: string;
    description?: string;
  },
) => {
  // check existing workspace
  const existingWorkspace = await Workspace.findOne({
    name: data.name,
  });

  if (existingWorkspace) {
    throw new Error("Workspace already exists");
  }

  // create workspace
  const workspace = await Workspace.create({
    name: data.name,

    description: data.description,

    owner: userId,
  });

  // add owner as workspace member
  await WorkspaceMember.create({
    workspace: workspace._id,

    user: userId,

    role: "manager",
  });

  return {
    workspace,
  };
};

export const getAllUserWorkspaces = async (userId: string) => {
  //  owned workspaces
  const ownedWorkspaces = await Workspace.find({
    owner: userId,
  }).populate("owner", "first_name last_name email");

  // memberships
  const memberships = await WorkspaceMember.find({
    user: userId,
  });

  // workspace ids
  const workspaceIds = memberships.map((member) => member.workspace);

  // member workspaces
  const memberWorkspaces = await Workspace.find({
    _id: { $in: workspaceIds },

    owner: { $ne: userId },
  }).populate("owner", "first_name last_name email");

  // combine
  const allWorkspaces = [...ownedWorkspaces, ...memberWorkspaces];

  return {
    allWorkspaces,
  };
};

export const getWorkspaceDetailInfo = async (
  userId: string,
  workspace_slug: string,
) => {
  const { isMember, isOwner, workspace } = await checkWorkspaceAccess(
    userId,
    workspace_slug,
  );

  if (!isMember && !isOwner) {
    throw new Error("You must be member of this workspace to view detail");
  }

  return {
    workspace,
  };
};

export const getAllMembers = async (userId: string, workspace_slug: string) => {
  const { isMember, isOwner, workspace } = await checkWorkspaceAccess(
    userId,
    workspace_slug,
  );

  const members = await WorkspaceMember.find({
    workspace: workspace._id,
  }).populate("user", "first_name last_name email");

  return {
    members,
  };
};

export const addMemberToWorkspace = async (
  userId: string,
  workspace_slug: string,
  new_member_email: string,
) => {
  const workspace = await Workspace.findOne({
    slug: workspace_slug,
  });

  if (!workspace) {
    throw new Error("Workspace not found");
  }

  const isUserAvailable = await User.findOne({
    email: new_member_email,
  });

  if (!isUserAvailable) {
    throw new Error("No such user available");
  }

  const isMemberAndManager = await WorkspaceMember.findOne({
    user: userId,

    workspace: workspace._id,

    role: "manager",
  });

  const isOwner = workspace.owner.toString() === userId;

  if (!isMemberAndManager && !isOwner) {
    throw new Error("You are not authorized to add member");
  }

  const isUserAlreadyMember = await WorkspaceMember.findOne({
    user: isUserAvailable._id,

    workspace: workspace._id,
  });

  if (isUserAlreadyMember) {
    throw new Error("User is already member");
  }

  const member = await WorkspaceMember.create({
    workspace: workspace._id,

    user: isUserAvailable._id,

    role: "leader",
  });

  return {
    member,
  };
};

export const getAllProjects = async (
  userId: string,
  workspace_slug: string,
) => {
  const { isMember, isOwner, workspace } = await checkWorkspaceAccess(
    userId,
    workspace_slug,
  );

  if (!isMember && !isOwner) {
    throw new Error("You are not authorized to view projects");
  }

  const projects = await Project.find({
    workspace: workspace._id,
  }).populate("createdBy", "first_name last_name email");

  return {
    projects,
  };
};

export const createProject = async (
  userId: string,
  workspace_slug: string,
  data: {
    name: string;
    description?: string;
  },
) => {
  const workspace = await Workspace.findOne({
    slug: workspace_slug,
  });

  if (!workspace) {
    throw new Error("Workspace not found");
  }

  const isUserMember = await WorkspaceMember.findOne({
    user: userId,

    workspace: workspace._id,

    role: {
      $in: ["leader", "manager"],
    },
  });

  const isOwner = workspace.owner.toString() === userId;

  if (!isUserMember && !isOwner) {
    throw new Error("You are not authorized to create project");
  }

  const existingProject = await Project.findOne({
    workspace: workspace._id,

    name: data.name,
  });

  if (existingProject) {
    throw new Error("Project already exists");
  }

  const project = await Project.create({
    name: data.name,

    description: data.description,

    workspace: workspace._id,

    createdBy: userId,
  });

  return {
    project,
  };
};

export const removeWorkspaceMember = async (
  userId: string,
  workspace_slug: string,
  memberId: string,
) => {
  const workspace = await Workspace.findOne({
    slug: workspace_slug,
  });

  if (!workspace) {
    throw new Error("Workspace not found");
  }

  // 🔥 permission check
  const isManager = await WorkspaceMember.findOne({
    user: userId,

    workspace: workspace._id,

    role: "manager",
  });

  const isOwner = workspace.owner.toString() === userId;

  if (!isManager && !isOwner) {
    throw new Error("You are not authorized to remove member");
  }

  // 🔥 prevent owner removal
  if (workspace.owner.toString() === memberId) {
    throw new Error("Owner cannot be removed");
  }

  const member = await WorkspaceMember.findOne({
    user: memberId,
    workspace: workspace._id,
  });
  if (!member) {
    throw new Error("Member not found");
  }

  await WorkspaceMember.deleteOne({
    _id: member._id,
  });

  return {
    message: "Member removed successfully",
  };
};
export const deleteWorkspace = async (
  userId: string,
  workspace_slug: string,
) => {
  const workspace = await Workspace.findOne({
    slug: workspace_slug,
  });

  if (!workspace) {
    throw new Error("Workspace not found");
  }

  // 🔥 only owner
  const isOwner = workspace.owner.toString() === userId;

  if (!isOwner) {
    throw new Error("Only owner can delete workspace");
  }

  // 🔥 delete members
  await WorkspaceMember.deleteMany({
    workspace: workspace._id,
  });

  // 🔥 delete projects
  await Project.deleteMany({
    workspace: workspace._id,
  });

  // 🔥 delete workspace
  await Workspace.deleteOne({
    _id: workspace._id,
  });

  return {
    message: "Workspace deleted successfully",
  };
};
