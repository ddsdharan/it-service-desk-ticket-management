import type { UserStatus } from "../../types/user";

interface UserStatusBadgeProps {
  status: UserStatus;
}

export default function UserStatusBadge({
  status,
}: UserStatusBadgeProps) {
  const styles =
    status === "active"
      ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
      : "bg-slate-100 text-slate-600 ring-1 ring-slate-200";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${styles}`}
    >
      {status}
    </span>
  );
}