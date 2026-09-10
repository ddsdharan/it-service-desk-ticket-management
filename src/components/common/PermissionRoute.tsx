import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import type { Permission } from "../../permissions/permissions";
import { usePermissions } from "../../hooks/usePermissions";

interface PermissionRouteProps {
  permission: Permission;
  children: ReactNode;
}

export function PermissionRoute({
  permission,
  children,
}: PermissionRouteProps) {
  const { can } = usePermissions();

  if (!can(permission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}