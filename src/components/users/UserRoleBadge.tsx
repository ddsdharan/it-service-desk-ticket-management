import type { UserRole } from "../../types/user";

interface UserRoleBadgeProps {
  role: UserRole;
}

const roleLabels: Record<UserRole, string> = {
  admin: "Admin",
  support_agent: "Support Agent",
  employee: "Employee",
};

export default function UserRoleBadge({
  role,
}: UserRoleBadgeProps) {
  return (
    <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-200">
      {roleLabels[role]}
    </span>
  );
}