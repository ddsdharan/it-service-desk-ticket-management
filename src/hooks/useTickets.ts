import { useQuery } from "@tanstack/react-query";
import { ticketService } from "../services/ticketService";

export function useTickets() {
  return useQuery({
    queryKey: ["tickets"],
    queryFn: ticketService.getTickets,
    staleTime: 30_000,
  });
}