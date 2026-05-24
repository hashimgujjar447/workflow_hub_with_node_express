import { Request, Response } from "express";

import {
  getAllProjectTasks,
  getSingleTaskDetail,
  updateTaskStatus,
  deleteTask,
} from "./task.services";

export const getAllTasks = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;

    const workspace_slug = req.params.workspace_slug;

    const project_slug = req.params.project_slug;

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

    const result = await getAllProjectTasks(
      userId.toString(),

      workspace_slug.toString(),

      project_slug.toString(),
    );

    return res.status(200).json({
      success: true,

      message: "All project tasks fetched successfully",

      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,

      message: error?.message || "Internal server error",
    });
  }
};

export const getTaskDetail = async (req: Request, res: Response) => {
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

    const result = await getSingleTaskDetail(
      userId.toString(),

      workspace_slug.toString(),

      project_slug.toString(),

      task_slug.toString(),
    );

    return res.status(200).json({
      success: true,

      message: "Task detail fetched successfully",

      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,

      message: error?.message || "Internal server error",
    });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;

    const workspace_slug = req.params.workspace_slug;

    const project_slug = req.params.project_slug;

    const task_slug = req.params.task_slug;

    const status = req.body.status;

    if (!userId) {
      return res.status(401).json({
        success: false,

        message: "Please login first",
      });
    }

    if (!status) {
      return res.status(400).json({
        success: false,

        message: "Status is required",
      });
    }

    const result = await updateTaskStatus(
      userId.toString(),

      workspace_slug.toString(),

      project_slug.toString(),

      task_slug.toString(),

      status,
    );

    return res.status(200).json({
      success: true,

      message: "Task status updated successfully",

      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,

      message: error?.message || "Internal server error",
    });
  }
};

export const removeTask = async (req: Request, res: Response) => {
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

    const result = await deleteTask(
      userId.toString(),

      workspace_slug.toString(),

      project_slug.toString(),

      task_slug.toString(),
    );

    return res.status(200).json({
      success: true,

      message: "Task deleted successfully",

      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,

      message: error?.message || "Internal server error",
    });
  }
};
