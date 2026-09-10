import {
  useState,
  type ReactNode,
} from "react";

import type {
  AuthUser,
  LoginCredentials,
} from "../../types/auth";

import { authService } from "../../services/authService";

import {
  AuthContext,
  type AuthContextValue,
} from "./auth-context";

interface AuthProviderProps {
  children: ReactNode;
}

const STORAGE_KEY = "it_service_desk_user";

function getStoredUser(): AuthUser | null {
  const storedUser = localStorage.getItem(STORAGE_KEY);

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser) as AuthUser;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(
    getStoredUser,
  );

  const [isLoading, setIsLoading] = useState(false);

  const login = async (
    credentials: LoginCredentials,
  ): Promise<AuthUser> => {
    setIsLoading(true);

    try {
      const authenticatedUser =
        await authService.login(credentials);

      setUser(authenticatedUser);

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(authenticatedUser),
      );

      return authenticatedUser;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const value: AuthContextValue = {
    user,
    isAuthenticated: Boolean(user),
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}