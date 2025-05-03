import express from "express";
import { getCurrentUser, login, logout, register, updateUser } from "./user.controllers.js";
import { authenticate } from "../../middleweres/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

router.get("/me", authenticate, getCurrentUser);
router.patch("/update", authenticate, updateUser);

export default router;
