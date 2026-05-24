import Workspace from "../../models/workspace.model";
import WorkspaceMember from "../../models/workspaceMember.model";
import Project from "../../models/workspaceProject.model";
import ProjectMember from "../../models/workspaceprojectMember.model";
import Task from "../../models/workspaceProjectTask";
import TaskComment from "../../models/workspaceProjectTaskComment";

export const createComment = async (
  userId: string,
  workspace_slug: string,
  project_slug: string,
  task_slug: string,
  data: {
    title: string;
    description?: string;
    parentComment?: string;
  },
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
    slug: task_slug,

    project: project._id,
  });

  if (!task) {
    throw new Error("No task found");
  }

  // reply validation
  if (data.parentComment) {
    const parentComment = await TaskComment.findById(data.parentComment);

    if (!parentComment) {
      throw new Error("Parent comment not found");
    }
  }

  const comment = await TaskComment.create({
    title: data.title,

    description: data.description || "",

    user: userId,

    task: task._id,

    parentComment: data.parentComment || null,
  });

  return {
    comment,
  };
};

export const getAllTaskComments = async (
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

  // task
  const task = await Task.findOne({
    slug: task_slug,

    project: project._id,
  });

  if (!task) {
    throw new Error("No task found");
  }

  // only top-level comments
  const comments = await TaskComment.find({
    task: task._id,

    parentComment: null,
  })
    .populate("user", "first_name last_name email")
    .sort({
      createdAt: -1,
    });

  return {
    comments,
  };
};

export const getCommentDetail = async (
  userId: string,
  workspace_slug: string,
  project_slug: string,
  task_slug: string,
  comment_slug: string,
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
    slug: task_slug,

    project: project._id,
  });

  if (!task) {
    throw new Error("No task found");
  }

  // main comment
  const mainComment = await TaskComment.findOne({
    slug: comment_slug,

    task: task._id,
  }).populate("user", "first_name last_name email");

  if (!mainComment) {
    throw new Error("Comment not found");
  }

  // replies
  const replies = await TaskComment.find({
    parentComment: mainComment._id,
  })
    .populate("user", "first_name last_name email")
    .sort({
      createdAt: 1,
    });

  return {
    comment: {
      ...mainComment.toObject(),

      replies,
    },
  };
};

export const deleteComment = async (
  userId: string,
  workspace_slug: string,
  project_slug: string,
  task_slug: string,
  comment_slug: string,
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
    slug: task_slug,

    project: project._id,
  });

  if (!task) {
    throw new Error("No task found");
  }

  const comment = await TaskComment.findOne({
    slug: comment_slug,

    task: task._id,
  });

  if (!comment) {
    throw new Error("Comment not found");
  }

  // creator only
  if (comment.user.toString() !== userId) {
    throw new Error("You are not authorized");
  }

  // delete replies too
  await TaskComment.deleteMany({
    parentComment: comment._id,
  });

  await TaskComment.deleteOne({
    _id: comment._id,
  });

  return {
    message: "Comment deleted successfully",
  };
};
