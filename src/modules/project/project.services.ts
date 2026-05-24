import User from "../../models/user.model";

import Workspace from "../../models/workspace.model";

import WorkspaceMember from "../../models/workspaceMember.model";

import Project from "../../models/workspaceProject.model";

import ProjectMember from "../../models/workspaceprojectMember.model";

export const getProjectDetails = async (
  userId: string,
  workspace_slug: string,
  project_slug: string,
) => {
  const workspace = await Workspace.findOne({
    slug: workspace_slug,
  });

  if (!workspace) {
    throw new Error("Workspace not found");
  }

  // workspace access
  const isMemberOfWorkspace = await WorkspaceMember.findOne({
    workspace: workspace._id,

    user: userId,
  });

  const isOwner = workspace.owner.toString() === userId;

  if (!isMemberOfWorkspace && !isOwner) {
    throw new Error("You are not member of the workspace");
  }

  const project = await Project.findOne({
    slug: project_slug,

    workspace: workspace._id,
  }).populate("createdBy", "first_name last_name email");

  if (!project) {
    throw new Error("No project found");
  }

  // project access
  const isMemberOfProject = await ProjectMember.findOne({
    project: project._id,

    user: userId,
  });

  const isProjectOwner = project.createdBy._id.toString() === userId;

  if (!isMemberOfProject && !isProjectOwner) {
    throw new Error("You are not part of project");
  }

  return {
    project,
  };
};

export const getAllProjectMembers = async (
  userId: string,
  workspace_slug: string,
  project_slug: string,
) => {
  const workspace = await Workspace.findOne({
    slug: workspace_slug,
  });

  if (!workspace) {
    throw new Error("Workspace not found");
  }

  // workspace access
  const isMemberOfWorkspace = await WorkspaceMember.findOne({
    workspace: workspace._id,

    user: userId,
  });

  const isOwner = workspace.owner.toString() === userId;

  if (!isMemberOfWorkspace && !isOwner) {
    throw new Error("You are not member of the workspace");
  }

  const project = await Project.findOne({
    slug: project_slug,

    workspace: workspace._id,
  }).populate("createdBy", "first_name last_name email");

  if (!project) {
    throw new Error("No project found");
  }

  // project access
  const isMemberOfProject = await ProjectMember.findOne({
    project: project._id,

    user: userId,
  });

  const isProjectOwner = project.createdBy._id.toString() === userId;

  if (!isMemberOfProject && !isProjectOwner) {
    throw new Error("You are not part of project");
  }

  // fetch members
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
  const workspace = await Workspace.findOne({
    slug: workspace_slug,
  });

  if (!workspace) {
    throw new Error("Workspace not found");
  }

  // workspace access
  const isMemberOfWorkspace = await WorkspaceMember.findOne({
    workspace: workspace._id,

    user: userId,
  });

  const isOwner = workspace.owner.toString() === userId;

  if (!isMemberOfWorkspace && !isOwner) {
    throw new Error("You are not member of the workspace");
  }

  const project = await Project.findOne({
    slug: project_slug,

    workspace: workspace._id,
  });

  if (!project) {
    throw new Error("Project not found");
  }

  // user exists?
  const user = await User.findOne({
    email: user_email,
  });

  if (!user) {
    throw new Error("No such user found");
  }

  // user must belong to workspace
  const isUserWorkspaceMember = await WorkspaceMember.findOne({
    workspace: workspace._id,

    user: user._id,
  });

  const isWorkspaceOwner = workspace.owner.toString() === user._id.toString();

  if (!isUserWorkspaceMember && !isWorkspaceOwner) {
    throw new Error("User is not member of workspace");
  }

  // permission check
  const isMemberOfProject = await ProjectMember.findOne({
    project: project._id,

    user: userId,

    role: "leader",
  });

  const isProjectOwner = project.createdBy.toString() === userId;

  if (!isMemberOfProject && !isProjectOwner) {
    throw new Error("You are not authorized to add members");
  }

  // already member?
  const isUserAlreadyMember = await ProjectMember.findOne({
    project: project._id,

    user: user._id,
  });

  if (isUserAlreadyMember) {
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
  const workspace = await Workspace.findOne({
    slug: workspace_slug,
  });

  if (!workspace) {
    throw new Error("Workspace not found");
  }

  const project = await Project.findOne({
    slug: project_slug,

    workspace: workspace._id,
  });

  if (!project) {
    throw new Error("Project not found");
  }

  // permission check
  const isLeader = await ProjectMember.findOne({
    project: project._id,

    user: userId,

    role: "leader",
  });

  const isProjectOwner = project.createdBy.toString() === userId;

  if (!isLeader && !isProjectOwner) {
    throw new Error("You are not authorized");
  }

  // update description only
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
  const workspace = await Workspace.findOne({
    slug: workspace_slug,
  });

  if (!workspace) {
    throw new Error("Workspace not found");
  }

  const project = await Project.findOne({
    slug: project_slug,

    workspace: workspace._id,
  });

  if (!project) {
    throw new Error("Project not found");
  }

  // permission check
  const isLeader = await ProjectMember.findOne({
    project: project._id,

    user: userId,

    role: "leader",
  });

  const isProjectOwner = project.createdBy.toString() === userId;

  if (!isLeader && !isProjectOwner) {
    throw new Error("You are not authorized");
  }

  // delete members
  await ProjectMember.deleteMany({
    project: project._id,
  });

  // later:
  // delete tasks/comments

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
  const workspace = await Workspace.findOne({
    slug: workspace_slug,
  });

  if (!workspace) {
    throw new Error("Workspace not found");
  }

  const project = await Project.findOne({
    slug: project_slug,

    workspace: workspace._id,
  });

  if (!project) {
    throw new Error("Project not found");
  }

  // permission check
  const isLeader = await ProjectMember.findOne({
    project: project._id,

    user: userId,

    role: "leader",
  });

  const isProjectOwner = project.createdBy.toString() === userId;

  if (!isLeader && !isProjectOwner) {
    throw new Error("You are not authorized");
  }

  // prevent owner removal
  if (project.createdBy.toString() === memberId) {
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
