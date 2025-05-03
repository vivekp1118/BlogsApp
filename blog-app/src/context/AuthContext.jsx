import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/v1';
console.log('baseUrl', baseUrl);
export const axiosInstance = axios.create({
    baseURL: baseUrl,
    withCredentials: true
});
const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const response = await axiosInstance.get(`/user/me`);

                if (response.data.success) {
                    setCurrentUser(response.data.result);
                    setIsAuthenticated(true);
                }
            } catch (err) {
                console.error('Authentication check failed:', err);
                setCurrentUser(null);
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        checkAuthStatus();
    }, []);

    const login = async (email, password) => {
        setError(null);
        try {
            const response = await axiosInstance.post(`/user/login`, {
                email,
                password
            });

            if (response.data.success) {
                const userResponse = await axiosInstance.get(`/user/me`);
                setCurrentUser(userResponse.data.result);
                setIsAuthenticated(true);
                return { success: true };
            } else {
                throw new Error(response.data.message || 'Login failed');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Login failed';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    const register = async (name, email, password, userName) => {
        setError(null);
        try {
            const response = await axiosInstance.post(`/user/register`, {
                name,
                email,
                password,
                userName
            });

            if (response.data.success) {
                const userResponse = await axiosInstance.get(`/user/me`);
                setCurrentUser(userResponse.data.result);
                setIsAuthenticated(true);
                return { success: true };
            } else {
                throw new Error(response.data.message || 'Registration failed');
            }
        } catch (err) {
            const errorMessage =
                err.response?.data?.message || 'Registration failed';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    const logout = async () => {
        try {
            await axiosInstance.post(`/user/logout`);
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            setCurrentUser(null);
            setIsAuthenticated(false);
        }
    };

    const updateProfile = async (userData) => {
        try {
            const response = await axiosInstance.patch(
                `/user/update`,
                userData
            );
            if (response.data.success) {
                const userResponse = await axiosInstance.get(`/user/me`);
                setCurrentUser(userResponse.data.result);
                return { success: true };
            } else {
                throw new Error(
                    response.data.message || 'Profile update failed'
                );
            }
        } catch (err) {
            const errorMessage =
                err.response?.data?.message || 'Profile update failed';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    const value = {
        currentUser,
        isAuthenticated,
        loading,
        error,
        login,
        register,
        logout,
        updateProfile
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
