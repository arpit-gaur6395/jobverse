import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        const token = authHeader?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                message: "Access denied. No token provided."
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select('_id name email role');

        if (!user) {
            return res.status(401).json({
                message: "Invalid token - user not found."
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Authentication error:", error.message);

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                message: "Token expired. Please login again."
            });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                message: "Invalid token format."
            });
        } else {
            return res.status(401).json({
                message: "Authentication failed."
            });
        }
    }
};

export const authorizeRoles = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                message: "Authentication required."
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: "Access denied. Insufficient permissions."
            });
        }

        next();
    };
};
