import { useQuery } from "@tanstack/react-query";
import { ticketService } from "../services/ticketService";

export const useTickets = () => {
  return useQuery({
    queryKey: ["tickets"],
    queryFn: ticketService.getTickets,
    staleTime: 30_000,
    retry: 1,
  });
};

export const useTicket = (ticketId: string | undefined) => {
  return useQuery({
    queryKey: ["ticket", ticketId],
    queryFn: () => ticketService.getTicket(ticketId!),
    enabled: Boolean(ticketId),
    staleTime: 30_000,
    retry: 1,
  });
};