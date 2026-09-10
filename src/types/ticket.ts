export type TicketPriority =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type TicketStatus =
  | "open"
  | "assigned"
  | "in_progress"
  | "pending"
  | "resolved"
  | "closed"
  | "cancelled"
  | "reopened";

export type ContactMethod =
  | "email"
  | "phone"
  | "chat";

export interface Ticket {
  id: string;
  subject: string;
  description: string;

  createdBy: string;
  assignedAgent: string | null;

  categoryId: string;

  priority: TicketPriority;
  status: TicketStatus;

  preferredContactMethod: ContactMethod;

  createdAt: string;
  updatedAt: string;

  dueDate: string | null;

  resolution: string | null;
  resolutionNotes: string | null;
  resolutionDate: string | null;
}