import { api } from "./api";
import type { User } from "../types/user";
import type { AuthUser, LoginCredentials } from "../types/auth";

export const authService = {
  login: async (
    credentials: LoginCredentials
  ): Promise<AuthUser> => {
    const response = await api.get<User[]>("/users", {
      params: {
        email: credentials.email,
        password: credentials.password,
        status: "active",
      },
    });

    const user = response.data[0];

    if (!user) {
      throw new Error("Invalid email or password.");
    }

    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      department: user.department,
    };
  },
};