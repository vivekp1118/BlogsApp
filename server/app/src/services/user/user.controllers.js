import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "./user.model.js";
import { badRequest, created, success, unauthorized } from "../../../utils/responseHandler.js";
import { handleError } from "../../../utils/handleError.js";
import { z } from "zod";
import { removeFields } from "../../../utils/removeFields.js";

const registerSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    userName: z.string().min(1, "Username is required"),
});

const register = async (req, res) => {
    try {
        const result = registerSchema.safeParse(req.body);
        if (!result.success) throw result.error;

        const { name, email, password, userName } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword, userName });

        return created(res, user, "User created successfully");
    } catch (error) {
        return handleError(error, res);
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) return unauthorized(res, "Invalid credentials");

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "24h" });

        res.cookie("access_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Only true in production
            sameSite: "strict", // Allow cross-site requests
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        return success(res, token, "Logged in successfully");
    } catch (error) {
        return handleError(error, res);
    }
};

const logout = (req, res) => {
    try {
        res.clearCookie("access_token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production" || true,
            sameSite: "None",
        });

        return success(res, null, "Logged out successfully");
    } catch (error) {
        return handleError(error, res);
    }
};

const getCurrentUser = (req, res) => {
    try {
        return success(res, req.user, "User retrieved successfully");
    } catch (error) {
        return handleError(error, res);
    }
};

const updateUser = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.user._id, req.body, { new: true });
        const userDetails = removeFields(updatedUser, [], true);
        return success(res, userDetails, "User updated successfully");
    } catch (error) {
        return handleError(error, res);
    }
};

const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.user._id);
        return success(res, null, "User deleted successfully");
    } catch (error) {
        return handleError(error, res);
    }
};

export { register, login, logout, getCurrentUser, updateUser, deleteUser };
