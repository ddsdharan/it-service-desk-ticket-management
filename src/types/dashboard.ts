import type { Ticket } from "./ticket";

export interface DashboardStats {
  total: number;
  open: number;
  assigned: number;
  inProgress: number;
  pending: number;
  resolved: number;
  closed: number;
  critical: number;
  unassigned: number;
}

export interface AgentDashboardStats {
  myAssigned: number;
  newTickets: number;
  inProgress: number;
  pending: number;
  resolved: number;
  highPriority: number;
}

export interface EmployeeDashboardStats {
  myTotal: number;
  open: number;
  inProgress: number;
  resolved: number;
  closed: number;
}

export function calculateDashboardStats(
  tickets: Ticket[],
): DashboardStats {
  return {
    total: tickets.length,

    open: tickets.filter(
      (ticket) => ticket.status === "open",
    ).length,

    assigned: tickets.filter(
      (ticket) => ticket.status === "assigned",
    ).length,

    inProgress: tickets.filter(
      (ticket) => ticket.status === "in_progress",
    ).length,

    pending: tickets.filter(
      (ticket) => ticket.status === "pending",
    ).length,

    resolved: tickets.filter(
      (ticket) => ticket.status === "resolved",
    ).length,

    closed: tickets.filter(
      (ticket) => ticket.status === "closed",
    ).length,

    critical: tickets.filter(
      (ticket) => ticket.priority === "critical",
    ).length,

    unassigned: tickets.filter(
      (ticket) => !ticket.assignedAgent,
    ).length,
  };
}

export function calculateAgentDashboardStats(
  tickets: Ticket[],
  userId: string,
): AgentDashboardStats {
  const myTickets = tickets.filter(
    (ticket) => ticket.assignedAgent === userId,
  );

  return {
    myAssigned: myTickets.length,

    newTickets: myTickets.filter(
      (ticket) =>
        ticket.status === "assigned" ||
        ticket.status === "reopened",
    ).length,

    inProgress: myTickets.filter(
      (ticket) => ticket.status === "in_progress",
    ).length,

    pending: myTickets.filter(
      (ticket) => ticket.status === "pending",
    ).length,

    resolved: myTickets.filter(
      (ticket) => ticket.status === "resolved",
    ).length,

    highPriority: myTickets.filter(
      (ticket) =>
        ticket.priority === "high" ||
        ticket.priority === "critical",
    ).length,
  };
}

export function calculateEmployeeDashboardStats(
  tickets: Ticket[],
  userId: string,
): EmployeeDashboardStats {
  const myTickets = tickets.filter(
    (ticket) => ticket.createdBy === userId,
  );

  return {
    myTotal: myTickets.length,

    open: myTickets.filter(
      (ticket) =>
        ticket.status === "open" ||
        ticket.status === "reopened",
    ).length,

    inProgress: myTickets.filter(
      (ticket) => ticket.status === "in_progress",
    ).length,

    resolved: myTickets.filter(
      (ticket) => ticket.status === "resolved",
    ).length,

    closed: myTickets.filter(
      (ticket) => ticket.status === "closed",
    ).length,
  };
}