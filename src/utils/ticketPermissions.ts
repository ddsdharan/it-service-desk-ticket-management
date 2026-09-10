import type { Ticket } from "../types/ticket";
import type { User as AuthUser } from "../types/user";

export function canViewTicket(
  ticket: Ticket,
  user: AuthUser | null,
): boolean {
  if (!user) {
    return false;
  }

  if (user.role === "admin") {
    return true;
  }

  if (user.role === "support_agent") {
    return (
      ticket.assignedAgent === user.id ||
      ticket.createdBy === user.id
    );
  }

  if (user.role === "employee") {
    return ticket.createdBy === user.id;
  }

  return false;
}

export function canEditTicket(
  ticket: Ticket,
  user: AuthUser | null,
): boolean {
  if (!user) {
    return false;
  }

  if (user.role === "admin") {
    return true;
  }

  if (user.role === "support_agent") {
    return ticket.assignedAgent === user.id;
  }

  if (user.role === "employee") {
    return (
      ticket.createdBy === user.id &&
      ticket.status === "open"
    );
  }

  return false;
}

export function canChangePriority(
  ticket: Ticket,
  user: AuthUser | null,
): boolean {
  if (!user) {
    return false;
  }

  if (user.role === "admin") {
    return true;
  }

  return (
    user.role === "support_agent" &&
    ticket.assignedAgent === user.id
  );
}

export function canAssignTicket(
  user: AuthUser | null,
): boolean {
  return user?.role === "admin";
}

export function canDeleteTicket(
  user: AuthUser | null,
): boolean {
  return user?.role === "admin";
}

export function canAddResolution(
  ticket: Ticket,
  user: AuthUser | null,
): boolean {
  if (!user) {
    return false;
  }

  if (
    ticket.status !== "in_progress" &&
    ticket.status !== "reopened"
  ) {
    return false;
  }

  if (user.role === "admin") {
    return true;
  }

  return (
    user.role === "support_agent" &&
    ticket.assignedAgent === user.id
  );
}

export function canCloseTicket(
  ticket: Ticket,
  user: AuthUser | null,
): boolean {
  if (!user || ticket.status !== "resolved") {
    return false;
  }

  if (user.role === "admin") {
    return true;
  }

  return (
    user.role === "support_agent" &&
    ticket.assignedAgent === user.id
  );
}