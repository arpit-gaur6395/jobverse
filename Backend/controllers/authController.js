import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ========================================
// 🔐 AUTHENTICATION CONTROLLERS
// ========================================

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid email
 */
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Array} - Array of error messages
 */
const validatePassword = (password) => {
    const errors = [];

    if (password.length < 8) {
        errors.push("Password must be at least 8 characters long");
    }

    if (password.length > 128) {
        errors.push("Password must be less than 128 characters");
    }

    // Check character types
    let charTypeCount = 0;
    if (/[A-Z]/.test(password)) charTypeCount++; // Uppercase
    if (/[a-z]/.test(password)) charTypeCount++; // Lowercase
    if (/\d/.test(password)) charTypeCount++; // Numbers
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) charTypeCount++; // Special

    if (charTypeCount < 2) {
        errors.push("Password must contain at least 2 of the following: uppercase letters, lowercase letters, numbers, or special characters");
    }

    // Check common passwords
    const commonPasswords = ['password', '12345678', 'qwerty123', 'admin123', 'password123', '123456789', 'abc123'];
    if (commonPasswords.includes(password.toLowerCase())) {
        errors.push("Password is too common. Please choose a more secure password");
    }

    return errors;
};

/**
 * Register a new user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Basic field validation
        if (!name || !email || !password || !role) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // Name validation
        if (name.length < 2 || name.length > 50) {
            return res.status(400).json({
                message: "Name must be between 2 and 50 characters"
            });
        }

        // Email validation
        if (!validateEmail(email)) {
            return res.status(400).json({
                message: "Invalid email format. Please enter a valid email address (e.g., user@example.com)"
            });
        }

        // Password validation
        const passwordErrors = validatePassword(password);
        if (passwordErrors.length > 0) {
            return res.status(400).json({
                message: "Password validation failed",
                errors: passwordErrors
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "User with this email already exists"
            });
        }

        // Hash password and create user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role
        });

        await newUser.save();

        // Generate JWT token
        const token = jwt.sign(
            { id: newUser._id, role: newUser.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(201).json({
            message: "User registered successfully",
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                role: newUser.role
            }
        });
    } catch (err) {
        console.error("Registration error:", err);
        res.status(500).json({
            message: "Failed to register user",
            error: err.message
        });
    }
};

/**
 * Login user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Basic field validation
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        // Email validation
        if (!validateEmail(email)) {
            return res.status(400).json({
                message: "Invalid email format. Please enter a valid email address (e.g., user@example.com)"
            });
        }

        // Password validation (basic check for empty string)
        if (password.trim() === '') {
            return res.status(400).json({
                message: "Password cannot be empty"
            });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                role: user.role
            }
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({
            message: "Failed to login",
            error: err.message
        });
    }
};

/**
 * Verify JWT token and return user data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const verifyToken = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                message: "No token provided"
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find user
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(401).json({
                message: "Invalid token - user not found"
            });
        }

        res.json({
            message: "Token is valid",
            user: {
                id: user._id,
                name: user.name,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Token verification error:", error);
        res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};
