import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { Admin } from "../models/admin.model.js";

export const verifyAdminJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            throw new ApiError(401, "Access token is required");
        }
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const admin = await Admin.findById(decodedToken?._id).select("-password -refreshToken");

        if (!admin) {
            throw new ApiError(404, "Admin not found");
        }
        req.admin = admin;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json(new ApiError(401, "Access token expired"));
        }
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json(new ApiError(401, "Invalid access token"));
        }
        return res.status(500).json(new ApiError(500, "Internal server error"));
    }
});