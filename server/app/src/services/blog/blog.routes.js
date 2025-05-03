import express from "express";
import { authenticate } from "../../middleweres/auth.js";
import { createBlog, getAllUsersBlogs, getUsersBlogs, removeBlog, updateBlog, getBlogDetails } from "./blog.controllers.js";
const router = express.Router();

router.post("/", authenticate, createBlog);
router.get("/", authenticate, getUsersBlogs);
router.get("/all", authenticate, getAllUsersBlogs);
router.get("/:id", authenticate, getBlogDetails);
router.patch("/:id", authenticate, updateBlog);
router.delete("/:id", authenticate, removeBlog);

export default router;
