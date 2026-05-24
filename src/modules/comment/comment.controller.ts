import { Request, Response } from "express";

import {
  getAllTaskComments,
  getCommentDetail,
  deleteComment,
} from "./comment.services";

export const getAllComments = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;

    const workspace_slug = req.params.workspace_slug;

    const project_slug = req.params.project_slug;

    const task_slug = req.params.task_slug;

    if (!userId) {
      return res.status(401).json({
        success: false,

        message: "Please login first",
      });
    }

    if (!workspace_slug) {
      return res.status(400).json({
        success: false,

        message: "Workspace slug is required",
      });
    }

    if (!project_slug) {
      return res.status(400).json({
        success: false,

        message: "Project slug is required",
      });
    }

    if (!task_slug) {
      return res.status(400).json({
        success: false,

        message: "Task slug is required",
      });
    }

    const result = await getAllTaskComments(
      userId.toString(),

      workspace_slug.toString(),

      project_slug.toString(),

      task_slug.toString(),
    );

    return res.status(200).json({
      success: true,

      message: "All comments fetched successfully",

      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,

      message: error?.message || "Internal server error",
    });
  }
};

export const getSingleComment = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;

    const workspace_slug = req.params.workspace_slug;

    const project_slug = req.params.project_slug;

    const task_slug = req.params.task_slug;

    const comment_slug = req.params.comment_slug;

    if (!userId) {
      return res.status(401).json({
        success: false,

        message: "Please login first",
      });
    }

    if (!workspace_slug) {
      return res.status(400).json({
        success: false,

        message: "Workspace slug is required",
      });
    }

    if (!project_slug) {
      return res.status(400).json({
        success: false,

        message: "Project slug is required",
      });
    }

    if (!task_slug) {
      return res.status(400).json({
        success: false,

        message: "Task slug is required",
      });
    }

    if (!comment_slug) {
      return res.status(400).json({
        success: false,

        message: "Comment slug is required",
      });
    }

    const result = await getCommentDetail(
      userId.toString(),

      workspace_slug.toString(),

      project_slug.toString(),

      task_slug.toString(),

      comment_slug.toString(),
    );

    return res.status(200).json({
      success: true,

      message: "Comment detail fetched successfully",

      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,

      message: error?.message || "Internal server error",
    });
  }
};

export const removeComment = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;

    const workspace_slug = req.params.workspace_slug;

    const project_slug = req.params.project_slug;

    const task_slug = req.params.task_slug;

    const comment_slug = req.params.comment_slug;

    if (!userId) {
      return res.status(401).json({
        success: false,

        message: "Please login first",
      });
    }

    const result = await deleteComment(
      userId.toString(),

      workspace_slug.toString(),

      project_slug.toString(),

      task_slug.toString(),

      comment_slug.toString(),
    );

    return res.status(200).json({
      success: true,

      message: "Comment deleted successfully",

      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,

      message: error?.message || "Internal server error",
    });
  }
};
