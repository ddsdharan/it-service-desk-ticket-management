import type { TicketStatus } from "../../types/ticket";

interface TicketStatusBadgeProps {
  status: TicketStatus;
}

const statusConfig: Record<
  TicketStatus,
  { label: string; className: string }
> = {
  open: {
    label: "Open",
    className: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  },
  assigned: {
    label: "Assigned",
    className: "bg-sky-50 text-sky-700 ring-sky-200",
  },
  in_progress: {
    label: "In Progress",
    className: "bg-cyan-50 text-cyan-700 ring-cyan-200",
  },
  pending: {
    label: "Pending",
    className: "bg-amber-50 text-amber-700 ring-amber-200",
  },
  resolved: {
    label: "Resolved",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  },
  closed: {
    label: "Closed",
    className: "bg-green-50 text-green-700 ring-green-200",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-rose-50 text-rose-700 ring-rose-200",
  },
  reopened: {
    label: "Reopened",
    className: "bg-violet-50 text-violet-700 ring-violet-200",
  },
};

export default function TicketStatusBadge({
  status,
}: TicketStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ring-1 ring-inset ${config.className}`}
    >
      {config.label}
    </span>
  );
}