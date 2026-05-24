import { Request, Response } from "express";
import {
  addMember,
  getAllProjectMembers,
  getProjectDetails,
  removeProjectMember,
  updateProject,
  deleteProject,
} from "./project.services";

export const getProjectDetail = async (req: Request, res: Response) => {
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
      return res.status(401).json({
        success: false,

        message: "Workspace slug is required",
      });
    }
    if (!project_slug) {
      return res.status(401).json({
        success: false,

        message: "Project slug is required",
      });
    }
    const result = await getProjectDetails(
      userId.toString(),
      workspace_slug.toString(),
      project_slug.toString(),
    );

    return res.status(200).json({
      success: true,

      message: "Project detail fetched successfully",

      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,

      message: error?.message || "Internal server error",
    });
  }
};

export const getProjectMembers = async (req: Request, res: Response) => {
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
      return res.status(401).json({
        success: false,

        message: "Workspace slug is required",
      });
    }
    if (!project_slug) {
      return res.status(401).json({
        success: false,

        message: "Project slug is required",
      });
    }

    const result = await getAllProjectMembers(
      userId.toString(),
      workspace_slug.toString(),
      project_slug.toString(),
    );

    return res.status(200).json({
      success: true,

      message: "Project members fetched successfully",

      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,

      message: error?.message || "Internal server error",
    });
  }
};

export const addMemberInProject = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const workspace_slug = req.params.workspace_slug;
    const project_slug = req.params.project_slug;
    const user_email = req.body.user_email;

    if (!userId) {
      return res.status(401).json({
        success: false,

        message: "Please login first",
      });
    }
    if (!workspace_slug) {
      return res.status(401).json({
        success: false,

        message: "Workspace slug is required",
      });
    }
    if (!project_slug) {
      return res.status(401).json({
        success: false,

        message: "Project slug is required",
      });
    }
    if (!user_email) {
      return res.status(401).json({
        success: false,

        message: "User email is required",
      });
    }

    const result = await addMember(
      userId.toString(),
      workspace_slug.toString(),
      project_slug.toString(),
      user_email,
    );

    return res.status(200).json({
      success: true,

      message: "Member added successfully",

      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,

      message: error?.message || "Internal server error",
    });
  }
};

export const removeMemberFromProject = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;

    const workspace_slug = req.params.workspace_slug;

    const project_slug = req.params.project_slug;

    const memberId = req.params.memberId;

    if (!userId) {
      return res.status(401).json({
        success: false,

        message: "Please login first",
      });
    }

    const result = await removeProjectMember(
      userId.toString(),

      workspace_slug.toString(),

      project_slug.toString(),

      memberId.toString(),
    );

    return res.status(200).json({
      success: true,

      message: "Member removed successfully",

      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,

      message: error?.message || "Internal server error",
    });
  }
};

export const updateProjectInfo = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;

    const workspace_slug = req.params.workspace_slug;

    const project_slug = req.params.project_slug;

    const data = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,

        message: "Please login first",
      });
    }

    const result = await updateProject(
      userId.toString(),

      workspace_slug.toString(),

      project_slug.toString(),

      data,
    );

    return res.status(200).json({
      success: true,

      message: "Project updated successfully",

      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,

      message: error?.message || "Internal server error",
    });
  }
};

export const removeProject = async (req: Request, res: Response) => {
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

    const result = await deleteProject(
      userId.toString(),

      workspace_slug.toString(),

      project_slug.toString(),
    );

    return res.status(200).json({
      success: true,

      message: "Project deleted successfully",

      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,

      message: error?.message || "Internal server error",
    });
  }
};
