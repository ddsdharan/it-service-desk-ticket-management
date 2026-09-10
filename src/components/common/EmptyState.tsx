import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: LucideIcon;
  action?: ReactNode;
}

export default function EmptyState({
  title = "No data available",
  message = "There is nothing to display here yet.",
  icon: Icon = Inbox,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white ring-1 ring-slate-200">
        <Icon
          className="h-5 w-5 text-slate-400"
          aria-hidden="true"
        />
      </div>

      <h2 className="mt-4 text-sm font-semibold text-slate-800">
        {title}
      </h2>

      <p className="mt-1 max-w-md text-sm text-slate-500">
        {message}
      </p>

      {action && <div className="mt-4">{action}</div>}
    </div>
  );
} 