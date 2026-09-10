import type { TicketStatus } from "../types/ticket";
import type { UserRole } from "../types/user";

interface LifecycleContext {
  role: UserRole;
  currentStatus: TicketStatus;
  nextStatus: TicketStatus;
  isAssignedAgent: boolean;
  isRequester: boolean;
}

const allowedTransitions: Record<
  TicketStatus,
  TicketStatus[]
> = {
  open: ["assigned", "cancelled"],
  assigned: ["in_progress"],
  in_progress: ["pending", "resolved"],
  pending: ["in_progress"],
  resolved: ["closed", "reopened"],
  closed: [],
  cancelled: [],
  reopened: ["assigned", "in_progress"],
};

export function isValidStatusTransition(
  currentStatus: TicketStatus,
  nextStatus: TicketStatus,
): boolean {
  if (currentStatus === nextStatus) {
    return false;
  }

  return allowedTransitions[currentStatus].includes(
    nextStatus,
  );
}

export function canChangeTicketStatus({
  role,
  currentStatus,
  nextStatus,
  isAssignedAgent,
  isRequester,
}: LifecycleContext): boolean {
  if (
    !isValidStatusTransition(
      currentStatus,
      nextStatus,
    )
  ) {
    return false;
  }

  // Admin has full lifecycle access.
  if (role === "admin") {
    return true;
  }

  // Support agents can manage tickets assigned to them.
  if (role === "support_agent") {
    if (!isAssignedAgent) {
      return false;
    }

    return [
      "in_progress",
      "pending",
      "resolved",
      "closed",
    ].includes(nextStatus);
  }

  // Employees can only cancel their own open tickets
  // and reopen their own resolved tickets.
  if (role === "employee") {
    if (!isRequester) {
      return false;
    }

    return (
      (currentStatus === "open" &&
        nextStatus === "cancelled") ||
      (currentStatus === "resolved" &&
        nextStatus === "reopened")
    );
  }

  return false;
}

export function getAllowedNextStatuses(
  ticketStatus: TicketStatus,
  role: UserRole,
  isAssignedAgent: boolean,
  isRequester: boolean,
): TicketStatus[] {
  return allowedTransitions[ticketStatus].filter(
    (nextStatus) =>
      canChangeTicketStatus({
        role,
        currentStatus: ticketStatus,
        nextStatus,
        isAssignedAgent,
        isRequester,
      }),
  );
}