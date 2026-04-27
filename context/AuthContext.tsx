"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import API from "@/lib/api";

interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  token?: string;
  bio?: string;
  skills?: string[];
  role?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (formData: any) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getErrorMessage = (error: any): string => {
  // Network error (server down, DB down, etc.)
  if (!error.response) {
    return "Unable to connect to server. Please check your internet connection and try again.";
  }

  const status = error.response.status;
  const message = error.response.data?.message;
  const validationErrors = error.response.data?.errors;

  const firstValidationError =
    validationErrors?.name?._errors?.[0] ||
    validationErrors?.username?._errors?.[0] ||
    validationErrors?.email?._errors?.[0] ||
    validationErrors?.password?._errors?.[0];

  switch (status) {
    case 400:
      return firstValidationError || message || "Invalid input. Please check your details and try again.";
    case 401:
      return message || "Invalid email or password.";
    case 404:
      return "Account not found. Please register first.";
    case 409:
      return message || "An account with this email/username already exists.";
    case 429:
      return "Too many attempts. Please wait a moment and try again.";
    case 500:
      if (message?.includes("MongoDB") || message?.includes("connect")) {
        return "Database is temporarily unavailable. Please try again in a moment.";
      }
      return "Server error. Please try again later.";
    default:
      return message || "Something went wrong. Please try again.";
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string) => {
    try {
      const { data } = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      setUser(data);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: getErrorMessage(error) };
    }
  };

  const register = async (formData: any) => {
    try {
      const { data } = await API.post("/auth/register", formData);
      localStorage.setItem("token", data.token);
      setUser(data);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: getErrorMessage(error) };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const loadUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token");
      const { data } = await API.get("/auth/me");
      setUser({ ...data, token });
    } catch (error) {
      // Silently handle auth failures on load (user just isn't logged in)
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
// End of file
