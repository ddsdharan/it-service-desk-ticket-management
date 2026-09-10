import type { UserRole } from "./user";

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  department: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}