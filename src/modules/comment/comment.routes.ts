import { Router } from "express";

import protect from "../../middleware/protect.middleware";

import {
  getAllComments,
  removeComment,
  getSingleComment,
} from "./comment.controller";

const router = Router();

// all task comments
router.get(
  "/:workspace_slug/:project_slug/:task_slug",
  protect,
  getAllComments,
);

// single comment detail
router.get(
  "/:workspace_slug/:project_slug/:task_slug/:comment_slug",
  protect,
  getSingleComment,
);

// delete comment
router.delete(
  "/:workspace_slug/:project_slug/:task_slug/:comment_slug",
  protect,
  removeComment,
);

export default router;
