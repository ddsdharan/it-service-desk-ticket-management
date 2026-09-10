// import { useQuery } from "@tanstack/react-query";
// import { ticketService } from "../services/ticketService";
// import { useAuth } from "./useAuth";

// export function useDashboardStats() {
//   const { user } = useAuth();

//   const query = useQuery({
//     queryKey: ["tickets"],
//     queryFn: ticketService.getTickets,
//     enabled: Boolean(user),
//   });

//   const tickets = query.data ?? [];

//   const adminStats = {
//     total: tickets.length,
//     open: tickets.filter(
//       (ticket) => ticket.status === "open"
//     ).length,
//     assigned: tickets.filter(
//       (ticket) => ticket.status === "assigned"
//     ).length,
//     inProgress: tickets.filter(
//       (ticket) => ticket.status === "in_progress"
//     ).length,
//     pending: tickets.filter(
//       (ticket) => ticket.status === "pending"
//     ).length,
//     resolved: tickets.filter(
//       (ticket) => ticket.status === "resolved"
//     ).length,
//     closed: tickets.filter(
//       (ticket) => ticket.status === "closed"
//     ).length,
//     critical: tickets.filter(
//       (ticket) => ticket.priority === "critical"
//     ).length,
//     unassigned: tickets.filter(
//       (ticket) => !ticket.assignedAgent
//     ).length,
//   };

//   const myTickets = tickets.filter((ticket) => {
//     if (!user) return false;

//     if (user.role === "support_agent") {
//       return ticket.assignedAgent === user.id;
//     }

//     return ticket.createdBy === user.id;
//   });

//   const agentStats = {
//     assigned: myTickets.length,

//     new: myTickets.filter(
//       (ticket) =>
//         ticket.status === "assigned" ||
//         ticket.status === "open"
//     ).length,

//     inProgress: myTickets.filter(
//       (ticket) => ticket.status === "in_progress"
//     ).length,

//     pending: myTickets.filter(
//       (ticket) => ticket.status === "pending"
//     ).length,

//     resolved: myTickets.filter(
//       (ticket) => ticket.status === "resolved"
//     ).length,

//     highPriority: myTickets.filter(
//       (ticket) =>
//         ticket.priority === "high" ||
//         ticket.priority === "critical"
//     ).length,
//   };

//   const employeeStats = {
//     total: myTickets.length,

//     open: myTickets.filter(
//       (ticket) => ticket.status === "open"
//     ).length,

//     inProgress: myTickets.filter(
//       (ticket) => ticket.status === "in_progress"
//     ).length,

//     resolved: myTickets.filter(
//       (ticket) => ticket.status === "resolved"
//     ).length,

//     closed: myTickets.filter(
//       (ticket) => ticket.status === "closed"
//     ).length,
//   };

//   return {
//     ...query,
//     tickets,
//     adminStats,
//     agentStats,
//     employeeStats,
//   };
// }

import { useQuery } from "@tanstack/react-query";

import { ticketService } from "../services/ticketService";
import { useAuth } from "./useAuth";

export function useDashboardStats() {
  const { user } = useAuth();

  const query = useQuery({
    queryKey: ["tickets"],
    queryFn: ticketService.getTickets,
    enabled: Boolean(user),
  });

  const tickets = query.data ?? [];

  /*
   * Role-based ticket visibility
   *
   * Admin        → all tickets
   * Support Agent → assigned tickets
   * Employee     → own tickets
   */
  const visibleTickets = tickets.filter((ticket) => {
    if (!user) {
      return false;
    }

    if (user.role === "admin") {
      return true;
    }

    if (user.role === "support_agent") {
      return ticket.assignedAgent === user.id;
    }

    return ticket.createdBy === user.id;
  });

  const adminStats = {
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

  const agentStats = {
    assigned: visibleTickets.length,

    new: visibleTickets.filter(
      (ticket) => ticket.status === "assigned",
    ).length,

    inProgress: visibleTickets.filter(
      (ticket) => ticket.status === "in_progress",
    ).length,

    pending: visibleTickets.filter(
      (ticket) => ticket.status === "pending",
    ).length,

    resolved: visibleTickets.filter(
      (ticket) => ticket.status === "resolved",
    ).length,

    highPriority: visibleTickets.filter(
      (ticket) =>
        ticket.priority === "high" ||
        ticket.priority === "critical",
    ).length,
  };

  const employeeStats = {
    total: visibleTickets.length,

    open: visibleTickets.filter(
      (ticket) => ticket.status === "open",
    ).length,

    inProgress: visibleTickets.filter(
      (ticket) => ticket.status === "in_progress",
    ).length,

    resolved: visibleTickets.filter(
      (ticket) => ticket.status === "resolved",
    ).length,

    closed: visibleTickets.filter(
      (ticket) => ticket.status === "closed",
    ).length,
  };

  return {
    ...query,
    tickets,
    visibleTickets,
    adminStats,
    agentStats,
    employeeStats,
  };
}