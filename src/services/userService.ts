import { api } from "./api";
import type { User } from "../types/user";

export const userService = {
  getUsers: async (): Promise<User[]> => {
    const response = await api.get<User[]>("/users");
    return response.data;
  },

  getUser: async (id: string): Promise<User> => {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  createUser: async (
    user: Omit<User, "id">,
  ): Promise<User> => {
    const response = await api.post<User>("/users", user);
    return response.data;
  },

  updateUser: async (
    id: string,
    user: Partial<User>,
  ): Promise<User> => {
    const response = await api.put<User>(
      `/users/${id}`,
      user,
    );
    return response.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};