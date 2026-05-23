import { Request, Response } from "express";

import {
  registerUser,
  loginUser,
  getUserInfo,
  logoutUser,
  refreshAccessToken,
} from "./auth.services";

import { registerSchema, loginSchema } from "./auth.validations";

export const register = async (req: Request, res: Response) => {
  try {
    const validatedData = registerSchema.safeParse(req.body);

    if (!validatedData.success) {
      return res.status(400).json({
        success: false,
        errors: validatedData.error.flatten(),
      });
    }

    const result = await registerUser(validatedData.data);

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const validatedData = loginSchema.safeParse(req.body);

    if (!validatedData.success) {
      return res.status(400).json({
        success: false,
        errors: validatedData.error.flatten(),
      });
    }

    const result = await loginUser(validatedData.data);

    res
      .cookie("refreshToken", result.refreshToken, {
        httpOnly: true,

        secure: false,

        sameSite: "lax",

        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        success: true,

        data: {
          user: result.user,
          accessToken: result.accessToken,
        },
      });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = await getUserInfo(req.user._id.toString());

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    await logoutUser();

    res
      .clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      })
      .status(200)
      .json({
        success: true,
        message: "Logout successful",
      });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    const result = await refreshAccessToken(refreshToken);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};
