// ─────────────────────────────────────────────────────────────────────────────
// src/context/AuthContext.js
//
// WHAT IS THIS MODULE?
//   Global React Authentication Context & State Provider for LocalFix.
//
// FEATURES:
//   - Manages logged-in user state, token, and active role.
//   - Synchronizes token with localStorage for persistent sessions.
//   - Handles user login, registration, and logout across the application.
// ─────────────────────────────────────────────────────────────────────────────

import React, { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("localfix_user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("localfix_token") || null;
  });

  const [loading, setLoading] = useState(true);

  // Restore authenticated session on initial app load
  useEffect(() => {
    const restoreSession = async () => {
      const storedToken = localStorage.getItem("localfix_token");
      if (storedToken) {
        try {
          const res = await authAPI.getMe();
          if (res.success && res.user) {
            setUser(res.user);
            localStorage.setItem("localfix_user", JSON.stringify(res.user));
          }
        } catch (error) {
          console.warn("Session expired or invalid:", error.message);
          logout();
        }
      }
      setLoading(false);
    };

    restoreSession();
  }, []);

  // ── 1. LOGIN METHOD ────────────────────────────────────────────────────────
  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    if (res.success && res.token) {
      localStorage.setItem("localfix_token", res.token);
      localStorage.setItem("localfix_user", JSON.stringify(res.user));
      setToken(res.token);
      setUser(res.user);
      return res.user;
    }
    throw new Error(res.error || "Login failed.");
  };

  // ── 2. REGISTER METHOD ─────────────────────────────────────────────────────
  const register = async (userData) => {
    const res = await authAPI.register(userData);
    if (res.success && res.token) {
      localStorage.setItem("localfix_token", res.token);
      localStorage.setItem("localfix_user", JSON.stringify(res.user));
      setToken(res.token);
      setUser(res.user);
      return res.user;
    }
    throw new Error(res.error || "Registration failed.");
  };

  // ── 3. LOGOUT METHOD ───────────────────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem("localfix_token");
    localStorage.removeItem("localfix_user");
    setToken(null);
    setUser(null);
  };

  // Helper getters
  const isAuthenticated = !!token && !!user;
  const role = user ? user.role : null;
  const isCustomer = role === "customer";
  const isProvider = role === "provider";
  const isAdmin = role === "admin";

  const value = {
    user,
    token,
    role,
    isAuthenticated,
    isCustomer,
    isProvider,
    isAdmin,
    loading,
    login,
    register,
    logout,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthContext;
