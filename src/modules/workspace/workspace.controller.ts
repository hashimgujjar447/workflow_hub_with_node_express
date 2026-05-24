import { Request, Response } from "express";

import {
  addMemberToWorkspace,
  createProject,
  deleteWorkspace,
  getAllMembers,
  getAllProjects,
  getAllUserWorkspaces,
  getWorkspaceDetailInfo,
  removeWorkspaceMember,
} from "./workspace.services";

export const getAllWorkspaces = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }

    const result = await getAllUserWorkspaces(userId.toString());

    return res.status(200).json({
      success: true,

      message: "Workspaces fetched successfully",

      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,

      message: error?.message || "Internal server error",
    });
  }
};

export const getWorkspaceDetail = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const slug = req.params.slug;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }
    const result = await getWorkspaceDetailInfo(
      userId.toString(),
      slug.toString(),
    );

    return res.status(200).json({
      success: true,

      message: "Workspace detail fetched successfully",

      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,

      message: error?.message || "Internal server error",
    });
  }
};

export const getWorkspaceMembers = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const slug = req.params.slug;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }
    const result = await getAllMembers(userId.toString(), slug.toString());

    return res.status(200).json({
      success: true,

      message: "Workspace members fetched successfully",

      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,

      message: error?.message || "Internal server error",
    });
  }
};

export const addMemberInWorkspace = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const slug = req.params.slug;
    const user_email = req.body.user_email;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }

    if (!slug) {
      return res.status(401).json({
        success: false,
        message: "Slug is required",
      });
    }

    if (!user_email) {
      return res.status(401).json({
        success: false,
        message: "Provide a valid user email",
      });
    }

    const result = await addMemberToWorkspace(
      userId.toString(),
      slug.toString(),
      user_email,
    );

    return res.status(200).json({
      success: true,

      message: "Member added in workspace successfully",

      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,

      message: error?.message || "Internal server error",
    });
  }
};

export const getAllWorkspacesProjects = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const slug = req.params.slug;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }

    if (!slug) {
      return res.status(401).json({
        success: false,
        message: "Slug is required",
      });
    }
    const result = await getAllProjects(userId.toString(), slug.toString());

    return res.status(200).json({
      success: true,

      message: "All projects fetched successfully",

      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,

      message: error?.message || "Internal server error",
    });
  }
};

export const createWorkspaceProject = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const slug = req.params.slug;
    const data = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }

    if (!slug) {
      return res.status(401).json({
        success: false,
        message: "Slug is required",
      });
    }

    if (!data.name) {
      return res.status(401).json({
        success: false,
        message: "name is required",
      });
    }
    const result = await createProject(
      userId.toString(),
      slug.toString(),
      data,
    );

    return res.status(200).json({
      success: true,

      message: "Project created successfully",

      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,

      message: error?.message || "Internal server error",
    });
  }
};

export const removeMemberFromWorkspace = async (
  req: Request,
  res: Response,
) => {
  try {
    const userId = req.user?._id;

    const slug = req.params.slug;

    const memberId = req.params.memberId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }

    const result = await removeWorkspaceMember(
      userId.toString(),

      slug.toString(),

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

export const removeWorkspace = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;

    const slug = req.params.slug;

    if (!userId) {
      return res.status(401).json({
        success: false,

        message: "Please login first",
      });
    }

    const result = await deleteWorkspace(
      userId.toString(),

      slug.toString(),
    );

    return res.status(200).json({
      success: true,

      message: "Workspace deleted successfully",

      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,

      message: error?.message || "Internal server error",
    });
  }
};
