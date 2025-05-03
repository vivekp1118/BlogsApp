import jwt from "jsonwebtoken";
import { notFound, unauthorized } from "../../utils/responseHandler.js";
import User from "../services/user/user.model.js";
import { handleError } from "../../utils/handleError.js";

export const authenticate = async (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
        return unauthorized(res, "access token not found");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password").lean();

        if (req?.user && req.user.role === "admin") req.body.createdBy = req.user._id;
        if (!req.user) {
            return notFound(res, "user not found");
        }
        next();
    } catch (err) {
        return handleError(err, res);
    }
};
