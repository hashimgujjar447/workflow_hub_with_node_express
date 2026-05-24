import Workspace from "../../models/workspace.model";

import WorkspaceMember from "../../models/workspaceMember.model";

import Project from "../../models/workspaceProject.model";

import ProjectMember from "../../models/workspaceprojectMember.model";

import Task from "../../models/workspaceProjectTask";

export const getAllProjectTasks = async (
  userId: string,
  workspace_slug: string,
  project_slug: string,
) => {
  const workspace = await Workspace.findOne({
    slug: workspace_slug,
  });

  if (!workspace) {
    throw new Error("No workspace found");
  }

  // workspace access
  const isWorkspaceMember = await WorkspaceMember.findOne({
    workspace: workspace._id,

    user: userId,
  });

  const isOwner = workspace.owner.toString() === userId;

  if (!isWorkspaceMember && !isOwner) {
    throw new Error("You are not member of workspace");
  }

  // project
  const project = await Project.findOne({
    workspace: workspace._id,

    slug: project_slug,
  });

  if (!project) {
    throw new Error("No project found");
  }

  // project access
  const isProjectMember = await ProjectMember.findOne({
    project: project._id,

    user: userId,
  });

  const isProjectOwner = project.createdBy.toString() === userId;

  if (!isProjectMember && !isProjectOwner) {
    throw new Error("Only authorized users can view tasks");
  }

  // tasks
  const allTasks = await Task.find({
    project: project._id,
  })
    .populate("createdBy", "first_name last_name email")
    .populate("assignedTo", "first_name last_name email");

  // grouped response
  const allTasksWithStatus = {
    todo: allTasks.filter((task) => task.status === "todo"),

    in_progress: allTasks.filter((task) => task.status === "in_progress"),

    completed: allTasks.filter((task) => task.status === "completed"),

    failed: allTasks.filter((task) => task.status === "failed"),
  };

  return {
    allTasksWithStatus,
  };
};

export const getSingleTaskDetail = async (
  userId: string,
  workspace_slug: string,
  project_slug: string,
  task_slug: string,
) => {
  const workspace = await Workspace.findOne({
    slug: workspace_slug,
  });

  if (!workspace) {
    throw new Error("No workspace found");
  }

  // workspace access
  const isWorkspaceMember = await WorkspaceMember.findOne({
    workspace: workspace._id,

    user: userId,
  });

  const isOwner = workspace.owner.toString() === userId;

  if (!isWorkspaceMember && !isOwner) {
    throw new Error("You are not member of workspace");
  }

  // project
  const project = await Project.findOne({
    workspace: workspace._id,

    slug: project_slug,
  });

  if (!project) {
    throw new Error("No project found");
  }

  // project access
  const isProjectMember = await ProjectMember.findOne({
    project: project._id,

    user: userId,
  });

  const isProjectOwner = project.createdBy.toString() === userId;

  if (!isProjectMember && !isProjectOwner) {
    throw new Error("Only authorized users can view tasks");
  }

  const task = await Task.findOne({
    project: project._id,
    slug: task_slug,
  })
    .populate("createdBy", "first_name last_name email")
    .populate("assignedTo", "first_name last_name email");

  return {
    task,
  };
};

export const updateTaskStatus = async (
  userId: string,
  workspace_slug: string,
  project_slug: string,
  task_slug: string,
  status: string,
) => {
  const workspace = await Workspace.findOne({
    slug: workspace_slug,
  });

  if (!workspace) {
    throw new Error("No workspace found");
  }

  // workspace access
  const isWorkspaceMember = await WorkspaceMember.findOne({
    workspace: workspace._id,

    user: userId,
  });

  const isOwner = workspace.owner.toString() === userId;

  if (!isWorkspaceMember && !isOwner) {
    throw new Error("You are not member of workspace");
  }

  // project
  const project = await Project.findOne({
    workspace: workspace._id,

    slug: project_slug,
  });

  if (!project) {
    throw new Error("No project found");
  }

  // project access
  const isProjectMember = await ProjectMember.findOne({
    project: project._id,

    user: userId,
  });

  const isProjectOwner = project.createdBy.toString() === userId;

  if (!isProjectMember && !isProjectOwner) {
    throw new Error("Only authorized users can update tasks");
  }

  // task
  const task = await Task.findOne({
    project: project._id,

    slug: task_slug,
  });

  if (!task) {
    throw new Error("Task not found");
  }

  // 🔥 ONLY ASSIGNED USER
  if (task.assignedTo?.toString() !== userId) {
    throw new Error("Only assigned user can update task status");
  }

  task.status = status as any;

  await task.save();

  return {
    task,
  };
};

export const deleteTask = async (
  userId: string,
  workspace_slug: string,
  project_slug: string,
  task_slug: string,
) => {
  const workspace = await Workspace.findOne({
    slug: workspace_slug,
  });

  if (!workspace) {
    throw new Error("No workspace found");
  }

  const project = await Project.findOne({
    workspace: workspace._id,

    slug: project_slug,
  });

  if (!project) {
    throw new Error("No project found");
  }

  const task = await Task.findOne({
    project: project._id,

    slug: task_slug,
  });

  if (!task) {
    throw new Error("Task not found");
  }

  // 🔥 creator OR project owner
  const isTaskCreator = task.createdBy.toString() === userId;

  const isProjectOwner = project.createdBy.toString() === userId;

  if (!isTaskCreator && !isProjectOwner) {
    throw new Error("You are not authorized to delete task");
  }

  await Task.deleteOne({
    _id: task._id,
  });

  return {
    message: "Task deleted successfully",
  };
};
