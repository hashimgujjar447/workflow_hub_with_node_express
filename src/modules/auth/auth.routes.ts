import { Router } from "express";

import {
  register,
  login,
  logout,
  refreshToken,
  getMe,
} from "./auth.controller";

import protect from "../../middleware/protect.middleware";

const router = Router();

// PUBLIC ROUTES

router.post("/register", register);

router.post("/login", login);

router.post("/refresh-token", refreshToken);

// PROTECTED ROUTES

router.get("/me", protect, getMe);

router.post("/logout", protect, logout);

export default router;
