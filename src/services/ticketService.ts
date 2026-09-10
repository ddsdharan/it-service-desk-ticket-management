import { api } from "./api";
import type { Ticket } from "../types/ticket";

export const ticketService = {
  getTickets: async (): Promise<Ticket[]> => {
    const response = await api.get<Ticket[]>("/tickets");
    return response.data;
  },

  getTicket: async (id: string): Promise<Ticket> => {
    const response = await api.get<Ticket>(`/tickets/${id}`);
    return response.data;
  },

  createTicket: async (ticket: Ticket): Promise<Ticket> => {
    const response = await api.post<Ticket>("/tickets", ticket);
    return response.data;
  },

  updateTicket: async (
    id: string,
    ticket: Partial<Ticket>,
  ): Promise<Ticket> => {
    const response = await api.patch<Ticket>(
      `/tickets/${id}`,
      ticket,
    );

    return response.data;
  },

  assignTicket: async (
  id: string,
  assignedAgent: string | null,
): Promise<Ticket> => {
  const currentTicket = await ticketService.getTicket(id);

  const nextStatus =
    assignedAgent && currentTicket.status === "open"
      ? "assigned"
      : !assignedAgent &&
          currentTicket.status === "assigned"
        ? "open"
        : currentTicket.status;

  const response = await api.patch<Ticket>(`/tickets/${id}`, {
    assignedAgent,
    status: nextStatus,
    updatedAt: new Date().toISOString(),
  });

  return response.data;
},

  deleteTicket: async (id: string): Promise<void> => {
    await api.delete(`/tickets/${id}`);
  },
};