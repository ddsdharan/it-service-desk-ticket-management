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
  const roleStyles: Record<UserRole, string> = {
    admin: "bg-violet-50 text-violet-700 ring-violet-200",
    support_agent: "bg-indigo-50 text-indigo-700 ring-indigo-200",
    employee: "bg-sky-50 text-sky-700 ring-sky-200",
  };

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${roleStyles[role]}`}>
      {roleLabels[role]}
    </span>
  );
}