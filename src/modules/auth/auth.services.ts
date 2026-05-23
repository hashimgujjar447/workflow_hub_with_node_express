import User from "../../models/user.model";

import generateAccessToken from "../../utils/generateAccessToken";

import generateRefreshToken from "../../utils/generateToken";
import verifyToken from "../../utils/verifyToken";

export const registerUser = async (payload: any) => {
  const existingUser = await User.findOne({
    email: payload.email,
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const user = await User.create(payload);

  return {
    user,
  };
};

export const loginUser = async (payload: any) => {
  const user = await User.findOne({
    email: payload.email,
  }).select("+password");

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await user.comparePassword(payload.password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const refreshToken = generateRefreshToken(user._id.toString());

  const accessToken = generateAccessToken(user._id.toString());

  return {
    user,
    refreshToken,
    accessToken,
  };
};

export const getUserInfo = async (userId: string) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User with the id not found");
    }

    return user;
  } catch (error) {
    throw error;
  }
};

export const logoutUser = async () => {
  return {
    message: "Logout successful",
  };
};

export const refreshAccessToken = async (refreshToken: string) => {
  if (!refreshToken) {
    throw new Error("Refresh token missing");
  }

  const decoded = verifyToken(refreshToken);

  const user = await User.findById(decoded.id);

  if (!user) {
    throw new Error("User not found");
  }

  const accessToken = generateAccessToken(user._id.toString());

  return {
    accessToken,
  };
};
