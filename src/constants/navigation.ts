import {
  BarChart3,
  FolderKanban,
  LayoutDashboard,
  Ticket,
  UserCircle,
  Users,
} from "lucide-react";

import type { Permission } from "../permissions/permissions";

export interface NavigationItem {
  label: string;
  path: string;
  icon: typeof LayoutDashboard;
  permission?: Permission;
}

export const navigationItems: NavigationItem[] = [
  {
    label: "Dashboard",
    path: "/app/dashboard",
    icon: LayoutDashboard,
    permission: "dashboard:view",
  },

  {
    label: "Tickets",
    path: "/app/tickets",
    icon: Ticket,
    permission: "tickets:view_own",
  },

  {
    label: "Users",
    path: "/app/users",
    icon: Users,
    permission: "users:manage",
  },

  {
    label: "Categories",
    path: "/app/categories",
    icon: FolderKanban,
    permission: "categories:manage",
  },

  {
    label: "Reports",
    path: "/app/reports",
    icon: BarChart3,
    permission: "reports:view",
  },

  {
    label: "Profile",
    path: "/app/profile",
    icon: UserCircle,
  },
];