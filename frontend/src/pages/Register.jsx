
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../config/axios";
import { AuthContext } from "../context/AuthContext";
import { API_URL } from "../config/api";

function Register() {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: "", email: "", password: "", role: "seeker" });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        // Name validation
        if (!form.name.trim()) {
            newErrors.name = "Name is required";
        } else if (form.name.length < 2) {
            newErrors.name = "Name must be at least 2 characters";
        } else if (form.name.length > 50) {
            newErrors.name = "Name must be less than 50 characters";
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!form.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!emailRegex.test(form.email)) {
            newErrors.email = "Please enter a valid email address (e.g., user@example.com)";
        }

        // Password validation
        const passwordErrors = [];
        if (!form.password) {
            newErrors.password = "Password is required";
        } else {
            if (form.password.length < 8) {
                passwordErrors.push("At least 8 characters");
            }
            if (form.password.length > 128) {
                passwordErrors.push("Less than 128 characters");
            }

            // Check if password contains at least two of the character types
            let charTypeCount = 0;

            if (/[A-Z]/.test(form.password)) {
                charTypeCount++; // Has uppercase
            }

            if (/[a-z]/.test(form.password)) {
                charTypeCount++; // Has lowercase
            }

            if (/\d/.test(form.password)) {
                charTypeCount++; // Has number
            }

            if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(form.password)) {
                charTypeCount++; // Has special character
            }

            // Require at least 2 different character types
            if (charTypeCount < 2) {
                passwordErrors.push("At least 2 character types (letters, numbers, special chars)");
            }

            // Check for common weak passwords
            const commonPasswords = ['password', '12345678', 'qwerty123', 'admin123', 'password123', '123456789', 'abc123'];
            if (commonPasswords.includes(form.password.toLowerCase())) {
                passwordErrors.push("Password is too common");
            }

            if (passwordErrors.length > 0) {
                newErrors.password = passwordErrors.join(", ");
            }
        }

        // Role validation
        if (!form.role) {
            newErrors.role = "Please select a role";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = e => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors({ ...errors, [name]: "" });
        }
    };

    const handleSubmit = async e => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            const res = await axiosInstance.post('/auth/register', form);
            login(res.data.user, res.data.token);
            navigate("/");
        } catch (err) {
            console.error("Registration error:", err);
            const errorMessage = err.response?.data?.message ||
                err.response?.data?.errors?.join(", ") ||
                err.message ||
                "Registration failed. Please try again.";
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-cover bg-center bg-fixed flex items-center justify-center p-4" style={{
            backgroundImage: "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1920')"
        }}>
            {/* Modern Form Section */}
            <div className="w-full max-w-md relative z-10">
                <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 border border-white border-opacity-20">
                    <div className="text-center mb-4 sm:mb-6 lg:mb-8">
                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2">Create Account</h2>
                        <p className="text-gray-200 text-sm sm:text-base">Join thousands of job seekers finding their dream jobs</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 lg:space-y-6">
                        {/* Name Input */}
                        <div className="">
                            <label className="block text-xs sm:text-sm font-medium text-gray-200 mb-1.5 sm:mb-2">
                                <span className="mr-1.5 sm:mr-2">👤</span>
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                className={`w-full p-3 sm:p-4 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white text-gray-800 placeholder-gray-500 text-sm sm:text-base ${errors.name ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="Enter your full name"
                                required
                            />
                            {errors.name && (
                                <p className="mt-1 text-xs text-red-400">{errors.name}</p>
                            )}
                        </div>

                        {/* Email Input */}
                        <div className="">
                            <label className="block text-xs sm:text-sm font-medium text-gray-200 mb-1.5 sm:mb-2">
                                <span className="mr-1.5 sm:mr-2">✉️</span>
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                className={`w-full p-3 sm:p-4 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white text-gray-800 placeholder-gray-500 text-sm sm:text-base ${errors.email ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="Enter your email"
                                required
                            />
                            {errors.email && (
                                <p className="mt-1 text-xs text-red-400">{errors.email}</p>
                            )}
                        </div>

                        {/* Password Input */}
                        <div className="">
                            <label className="block text-xs sm:text-sm font-medium text-gray-200 mb-1.5 sm:mb-2">
                                <span className="mr-1.5 sm:mr-2">🔒</span>
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                className={`w-full p-3 sm:p-4 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white text-gray-800 placeholder-gray-500 text-sm sm:text-base ${errors.password ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="Create a strong password"
                                required
                            />
                            {errors.password && (
                                <p className="mt-1 text-xs text-red-400">{errors.password}</p>
                            )}
                            <p className="mt-2 text-xs text-gray-300">
                                Password must contain: 8+ characters and at least 2 of the following: uppercase letters, lowercase letters, numbers, or special characters
                            </p>
                        </div>

                        {/* Role Selection */}
                        <div className="">
                            <label className="block text-xs sm:text-sm font-medium text-gray-200 mb-1.5 sm:mb-2">
                                <span className="mr-1.5 sm:mr-2">🎯</span>
                                I am a
                            </label>
                            <select
                                name="role"
                                value={form.role}
                                onChange={handleChange}
                                className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white text-gray-800 text-sm sm:text-base"
                                required
                            >
                                <option value="seeker">Job Seeker</option>
                                <option value="employer">Employer</option>
                            </select>
                        </div>

                        {/* Submit Button */}
                        <div className="">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-orange-400 to-amber-400 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-lg font-semibold hover:from-orange-500 hover:to-amber-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base transform hover:-translate-y-0.5 hover:shadow-lg"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1.5 sm:mr-2"></div>
                                        Creating Account...
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center">
                                        <span>Create Account</span>
                                        <span className="ml-1.5 sm:ml-2">→</span>
                                    </div>
                                )}
                            </button>
                        </div>

                        {/* Form Footer */}
                        <div className="text-center mt-4 sm:mt-6">
                            <p className="text-gray-200 text-xs sm:text-sm">
                                Already have an account?{' '}
                                <a href="/login" className="text-blue-300 hover:text-blue-400 font-medium transition-colors">
                                    Sign In
                                </a>
                            </p>
                            <div className="flex justify-center gap-2 sm:gap-3 sm:gap-4 mt-3 sm:mt-4 text-xs sm:text-sm text-gray-300">
                                <span className="flex items-center"><span className="text-green-500 mr-0.5 sm:mr-1">✓</span> Free forever</span>
                                <span className="flex items-center"><span className="text-green-500 mr-0.5 sm:mr-1">✓</span> No credit card</span>
                                <span className="flex items-center"><span className="text-green-500 mr-0.5 sm:mr-1">✓</span> Quick setup</span>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Register;
