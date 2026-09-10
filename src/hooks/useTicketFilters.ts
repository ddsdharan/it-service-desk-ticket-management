import { useMemo, useState } from "react";

import type {
  Ticket,
  TicketPriority,
} from "../types/ticket";

import type { TicketFilterState } from "../components/tickets/TicketFilters";

const defaultFilters: TicketFilterState = {
  search: "",
  status: "all",
  priority: "all",
  categoryId: "",
  agentId: "",
  date: "",
  sort: "newest",
};

const priorityRank: Record<TicketPriority, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

const PAGE_SIZE = 10;

export const useTicketFilters = (
  tickets: Ticket[],
  userNames: Record<string, string> = {},
) => {
  const [filters, setFilters] =
    useState<TicketFilterState>(defaultFilters);

  const [currentPage, setCurrentPage] = useState(1);

  const updateFilter = (
    key: keyof TicketFilterState,
    value: string,
  ) => {
    setFilters((current) => ({
      ...current,
      [key]: value,
    }));

    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
    setCurrentPage(1);
  };

  const filteredTickets = useMemo(() => {
    const now = new Date();

    const result = tickets.filter((ticket) => {
      const search = filters.search.trim().toLowerCase();

      if (search) {
        const requesterName =
          userNames[ticket.createdBy] ?? "";

        const assignedAgentName = ticket.assignedAgent
          ? userNames[ticket.assignedAgent] ?? ""
          : "";

        const searchableText = [
          ticket.id,
          ticket.subject,
          ticket.description,
          ticket.createdBy,
          ticket.assignedAgent ?? "",
          requesterName,
          assignedAgentName,
        ]
          .join(" ")
          .toLowerCase();

        if (!searchableText.includes(search)) {
          return false;
        }
      }

      if (
        filters.status !== "all" &&
        ticket.status !== filters.status
      ) {
        return false;
      }

      if (
        filters.priority !== "all" &&
        ticket.priority !== filters.priority
      ) {
        return false;
      }

      if (
        filters.categoryId &&
        ticket.categoryId !== filters.categoryId
      ) {
        return false;
      }

      if (
        filters.agentId &&
        ticket.assignedAgent !== filters.agentId
      ) {
        return false;
      }

      if (filters.date) {
        const createdAt = new Date(ticket.createdAt);

        if (Number.isNaN(createdAt.getTime())) {
          return false;
        }

        if (filters.date === "today") {
          const startOfToday = new Date(now);
          startOfToday.setHours(0, 0, 0, 0);

          if (createdAt < startOfToday) {
            return false;
          }
        }

        if (filters.date === "7") {
          const sevenDaysAgo = new Date(now);
          sevenDaysAgo.setDate(
            sevenDaysAgo.getDate() - 7,
          );

          if (createdAt < sevenDaysAgo) {
            return false;
          }
        }

        if (filters.date === "30") {
          const thirtyDaysAgo = new Date(now);
          thirtyDaysAgo.setDate(
            thirtyDaysAgo.getDate() - 30,
          );

          if (createdAt < thirtyDaysAgo) {
            return false;
          }
        }
      }

      return true;
    });

    result.sort((a, b) => {
      if (filters.sort === "newest") {
        return (
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
        );
      }

      if (filters.sort === "oldest") {
        return (
          new Date(a.createdAt).getTime() -
          new Date(b.createdAt).getTime()
        );
      }

      if (filters.sort === "priority") {
        const priorityDifference =
          priorityRank[b.priority] -
          priorityRank[a.priority];

        if (priorityDifference !== 0) {
          return priorityDifference;
        }

        return (
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
        );
      }

      if (filters.sort === "updated") {
        return (
          new Date(b.updatedAt).getTime() -
          new Date(a.updatedAt).getTime()
        );
      }

      return 0;
    });

    return result;
  }, [tickets, filters, userNames]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredTickets.length / PAGE_SIZE),
  );

  const effectiveCurrentPage = Math.min(currentPage, totalPages);

  const paginatedTickets = useMemo(() => {
    const startIndex =
      (effectiveCurrentPage - 1) * PAGE_SIZE;

    return filteredTickets.slice(
      startIndex,
      startIndex + PAGE_SIZE,
    );
  }, [filteredTickets, effectiveCurrentPage]);

  const goToPage = (page: number) => {
    const safePage = Math.min(
      Math.max(page, 1),
      totalPages,
    );

    setCurrentPage(safePage);
  };

  return {
    filters,
    filteredTickets,
    paginatedTickets,
    currentPage: effectiveCurrentPage,
    totalPages,
    pageSize: PAGE_SIZE,
    goToPage,
    updateFilter,
    resetFilters,
  };
};