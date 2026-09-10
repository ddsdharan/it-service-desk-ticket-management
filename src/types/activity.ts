export type ActivityType =
  | "created"
  | "comment"
  | "assigned"
  | "reassigned"
  | "unassigned"
  | "status_changed"
  | "priority_changed"
  | "resolved"
  | "reopened";

export interface TicketActivity {
  id: string;
  ticketId: string;
  userId: string;
  type: ActivityType;
  message: string;
  createdAt: string;
}