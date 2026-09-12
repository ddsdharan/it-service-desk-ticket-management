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
    className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  },
  medium: {
    label: "Medium",
    className: "bg-amber-50 text-amber-700 ring-amber-200",
  },
  high: {
    label: "High",
    className: "bg-orange-50 text-orange-700 ring-orange-200",
  },
  critical: {
    label: "Critical",
    className: "bg-rose-50 text-rose-700 ring-rose-200",
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