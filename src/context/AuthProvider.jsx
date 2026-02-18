import { useState, useEffect, useCallback } from "react";
import { AuthContext } from "./AuthContext";
import {
  getCurrentUser,
  loginWithGoogle,
  registerWithGoogle,
} from "../services/api/auth.js";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem("jwt_token");

    if (token) {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch {
        localStorage.removeItem("jwt_token");
        setUser(null);
      }
    }

    setLoading(false);
  }, []);

  const login = useCallback(async (googleIdToken) => {
    try {
      let response;

      try {
        response = await loginWithGoogle(googleIdToken);
      } catch (loginError) {
        if (loginError.message.includes("not found")) {
          response = await registerWithGoogle(googleIdToken);
        } else {
          throw loginError;
        }
      }

      localStorage.setItem("jwt_token", response.token);

      const userData = await getCurrentUser();
      setUser(userData);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Login failed",
      };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("jwt_token");
    setUser(null);
  }, []);

  const isAdmin = useCallback(() => user?.role === "Admin", [user]);
  const isOperator = useCallback(() => user?.role === "Operator", [user]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAdmin,
        isOperator,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
