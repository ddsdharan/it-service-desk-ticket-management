import type { TicketPriority } from "../../types/ticket";

interface TicketPriorityBadgeProps {
  priority: TicketPriority;
}

const priorityConfig: Record<
  TicketPriority,
  { label: string; className: string }
> = {
  low: {
    label: "Low",
    className: "bg-slate-100 text-slate-600 ring-slate-200",
  },
  medium: {
    label: "Medium",
    className: "bg-blue-50 text-blue-700 ring-blue-200",
  },
  high: {
    label: "High",
    className: "bg-orange-50 text-orange-700 ring-orange-200",
  },
  critical: {
    label: "Critical",
    className: "bg-red-50 text-red-700 ring-red-200",
  },
};

export default function TicketPriorityBadge({
  priority,
}: TicketPriorityBadgeProps) {
  const config = priorityConfig[priority];

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${config.className}`}
    >
      {config.label}
    </span>
  );
}