import express from "express";
import {
  CreatePost,
  GetPost,
  UpdatePost,
  DeletePost,
  LikePost,
  GetTimelinePosts
} from "../controllers/PostController.js";

const router = express.Router();

router.post("/", CreatePost);
router.get("/:id", GetPost);
router.put("/:id", UpdatePost);
router.delete("/:id", DeletePost);
router.put("/:id/like", LikePost);
router.get("/:id/timeline", GetTimelinePosts);

export default router;
