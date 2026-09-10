import type { Permission } from "../permissions/permissions";
import { rolePermissions } from "../permissions/rolePermissions";
import { useAuth } from "./useAuth";

export function usePermissions() {
  const { user } = useAuth();

  const can = (permission: Permission): boolean => {
    if (!user) {
      return false;
    }

    return rolePermissions[user.role].includes(permission);
  };

  const canAny = (
    permissions: Permission[]
  ): boolean => {
    return permissions.some(can);
  };

  const canAll = (
    permissions: Permission[]
  ): boolean => {
    return permissions.every(can);
  };

  return {
    can,
    canAny,
    canAll,
  };
}