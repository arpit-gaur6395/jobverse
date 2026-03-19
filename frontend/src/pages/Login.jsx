import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../config/axios";
import { AuthContext } from "../context/AuthContext";
import { API_URL } from "../config/api";

function Login() {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axiosInstance.post('/auth/login', form);
            login(res.data.user, res.data.token);
            navigate("/");
        } catch (err) {
            console.error("Login error:", err);
            const errorMessage = err.response?.data?.message ||
                err.message ||
                "Login failed. Please check your credentials.";
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-cover bg-center bg-fixed flex items-center justify-center p-4" style={{
            backgroundImage: "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1920')"
        }}>
            {/* Modern Form Section */}
            <div className="w-full max-w-md relative z-10">
                <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 border border-white border-opacity-20">
                    <div className="text-center mb-4 sm:mb-6 lg:mb-8">
                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2">Sign In</h2>
                        <p className="text-gray-200 text-sm sm:text-base">Welcome back! Please enter your credentials</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 lg:space-y-6">
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
                                className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white text-gray-800 placeholder-gray-500 text-sm sm:text-base"
                                placeholder="Enter your email"
                                required
                            />
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
                                className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white text-gray-800 placeholder-gray-500 text-sm sm:text-base"
                                placeholder="Enter your password"
                                required
                            />
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
                                        Signing In...
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center">
                                        <span>Sign In</span>
                                        <span className="ml-1.5 sm:ml-2">→</span>
                                    </div>
                                )}
                            </button>
                        </div>

                        {/* Form Footer */}
                        <div className="text-center mt-4 sm:mt-6">
                            <p className="text-gray-200 text-xs sm:text-sm">
                                Don't have an account?{' '}
                                <a href="/register" className="text-blue-300 hover:text-blue-400 font-medium transition-colors">
                                    Sign Up
                                </a>
                            </p>
                            <div className="flex justify-center gap-2 sm:gap-3 sm:gap-4 mt-3 sm:mt-4 text-xs sm:text-sm text-gray-300">
                                <span className="flex items-center"><span className="text-green-500 mr-0.5 sm:mr-1">✓</span> Secure login</span>
                                <span className="flex items-center"><span className="text-green-500 mr-0.5 sm:mr-1">✓</span> Quick access</span>
                                <span className="flex items-center"><span className="text-green-500 mr-0.5 sm:mr-1">✓</span> 24/7 Support</span>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
