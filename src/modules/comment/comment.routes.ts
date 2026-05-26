import { Router } from "express";

import protect from "../../middleware/protect.middleware";

import {
  getAllComments,
  removeComment,
  getSingleComment,
  addComment,
} from "./comment.controller";

const router = Router({
  mergeParams: true,
});

// all task comments
router.get("/", protect, getAllComments);

// create comment
router.post("/", protect, addComment);
// single comment detail
router.get("/:comment_slug", protect, getSingleComment);

// delete comment
router.delete("/:comment_slug", protect, removeComment);

export default router;
