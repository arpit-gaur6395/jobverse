import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ========================================
// 🔐 AUTHENTICATION MIDDLEWARE
// ========================================

/**
 * Authenticate JWT token and attach user to request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const authenticateToken = async (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.header('Authorization');
        const token = authHeader?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                message: "Access denied. No token provided."
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find user
        const user = await User.findById(decoded.id).select('_id name email role');

        if (!user) {
            return res.status(401).json({
                message: "Invalid token - user not found."
            });
        }

        // Attach user to request
        req.user = user;
        next();
    } catch (error) {
        console.error("Authentication error:", error.message);

        // Handle different JWT errors
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

/**
 * Middleware to check if user has required role
 * @param {Array} allowedRoles - Array of allowed roles
 * @returns {Function} - Middleware function
 */
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
