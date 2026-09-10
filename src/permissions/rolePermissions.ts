import type { UserRole } from "../types/user";
import type { Permission } from "./permissions";

export const rolePermissions: Record<
  UserRole,
  Permission[]
> = {
  admin: [
    "dashboard:view",

    "tickets:view_all",
    "tickets:view_assigned",
    "tickets:view_own",
    "tickets:create",
    "tickets:edit",
    "tickets:delete",
    "tickets:assign",
    "tickets:reassign",
    "tickets:update_status",
    "tickets:update_priority",

    "comments:view",
    "comments:create",
    "comments:edit",
    "comments:delete",

    "resolution:create",
    "resolution:view",

    "users:manage",
    "categories:manage",
    "reports:view",
  ],

  support_agent: [
    "dashboard:view",

    "tickets:view_assigned",
    "tickets:view_own",
    "tickets:create",
    "tickets:edit",
    "tickets:update_status",
    "tickets:update_priority",

    "comments:view",
    "comments:create",

    "resolution:create",
    "resolution:view",
  ],

  employee: [
    "dashboard:view",

    "tickets:view_own",
    "tickets:create",

    "comments:create",

    "resolution:view",
  ],
};