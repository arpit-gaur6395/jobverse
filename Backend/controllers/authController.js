import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Basic field validation
        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Name validation
        if (name.length < 2 || name.length > 50) {
            return res.status(400).json({ message: "Name must be between 2 and 50 characters" });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Invalid email format. Please enter a valid email address (e.g., user@example.com)"
            });
        }

        // Password validation
        const passwordErrors = [];

        if (password.length < 8) {
            passwordErrors.push("Password must be at least 8 characters long");
        }

        if (password.length > 128) {
            passwordErrors.push("Password must be less than 128 characters");
        }

        // Check if password contains at least two of the three character types
        let charTypeCount = 0;

        if (/[A-Z]/.test(password)) {
            charTypeCount++; // Has uppercase
        }

        if (/[a-z]/.test(password)) {
            charTypeCount++; // Has lowercase
        }

        if (/\d/.test(password)) {
            charTypeCount++; // Has number
        }

        if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
            charTypeCount++; // Has special character
        }

        // Require at least 2 different character types (from letters, numbers, special chars)
        if (charTypeCount < 2) {
            passwordErrors.push("Password must contain at least 2 of the following: uppercase letters, lowercase letters, numbers, or special characters");
        }

        // Check for common weak passwords
        const commonPasswords = ['password', '12345678', 'qwerty123', 'admin123', 'password123', '123456789', 'abc123'];
        if (commonPasswords.includes(password.toLowerCase())) {
            passwordErrors.push("Password is too common. Please choose a more secure password");
        }

        if (passwordErrors.length > 0) {
            return res.status(400).json({
                message: "Password validation failed",
                errors: passwordErrors
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword, role });
        await newUser.save();

        const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(201).json({
            message: "User registered successfully",
            token,
            user: { id: newUser._id, name: newUser.name, role: newUser.role }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Basic field validation
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Invalid email format. Please enter a valid email address (e.g., user@example.com)"
            });
        }

        // Password validation (basic check for empty string)
        if (password.trim() === '') {
            return res.status(400).json({ message: "Password cannot be empty" });
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({
            token,
            user: { id: user._id, name: user.name, role: user.role }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

export const verifyToken = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(401).json({ message: "Invalid token" });
        }

        res.json({
            user: { id: user._id, name: user.name, role: user.role }
        });
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};
