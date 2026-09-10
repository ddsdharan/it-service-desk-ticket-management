import { useMemo } from "react";
import { CheckCircle2, ChevronDown } from "lucide-react";
import type { TicketStatus } from "../../types/ticket";
import type { UserRole } from "../../types/user";
import { getAllowedNextStatuses } from "../../utils/ticketLifecycle";

interface TicketStatusActionsProps {
  role: UserRole;
  currentStatus: TicketStatus;
  isAssignedAgent: boolean;
  isRequester: boolean;
  isUpdating: boolean;
  onStatusChange: (status: TicketStatus) => void;
}

const statusLabels: Record<TicketStatus, string> = {
  open: "Open",
  assigned: "Assigned",
  in_progress: "In Progress",
  pending: "Pending",
  resolved: "Resolved",
  closed: "Closed",
  cancelled: "Cancelled",
  reopened: "Reopened",
};

export default function TicketStatusActions({
  role,
  currentStatus,
  isAssignedAgent,
  isRequester,
  isUpdating,
  onStatusChange,
}: TicketStatusActionsProps) {
  const allowedStatuses = useMemo(
    () =>
      getAllowedNextStatuses(
        currentStatus,
        role,
        isAssignedAgent,
        isRequester,
      ),
    [
      currentStatus,
      role,
      isAssignedAgent,
      isRequester,
    ],
  );

  const visibleStatuses = allowedStatuses.filter(
    (status) => status !== "resolved",
  );

  if (visibleStatuses.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {visibleStatuses.map((status) => (
        <button
          key={status}
          type="button"
          disabled={isUpdating}
          onClick={() => onStatusChange(status)}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <CheckCircle2 className="h-4 w-4" />

          {statusLabels[status]}

          <ChevronDown className="h-3.5 w-3.5 opacity-60" />
        </button>
      ))}
    </div>
  );
}