import { createContext, useState, useEffect } from "react";
import axiosInstance from "../config/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (storedUser && token) {
          // Verify token is still valid by making a request
          const response = await axiosInstance.get("/auth/verify");

          if (response.data.success && response.data.user) {
            setUser(JSON.parse(storedUser));
            setError(null);
          } else {
            // Token is invalid, clear storage
            clearAuthData();
            setError('Session expired. Please login again.');
          }
        }
      } catch (error) {
        // Token is invalid or expired, clear storage
        clearAuthData();
        setError('Authentication failed. Please login again.');
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const clearAuthData = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  const login = (userData, token) => {
    try {
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", token);
      setError(null);
    } catch (error) {
      console.error('Login error:', error);
      setError('Failed to save login information');
    }
  };

  const logout = () => {
    clearAuthData();
    setError(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      updateUser,
      loading,
      error,
      isAuthenticated: !!user,
      isJobSeeker: user?.role === 'seeker',
      isEmployer: user?.role === 'employer'
    }}>
      {children}
    </AuthContext.Provider>
  );
};
