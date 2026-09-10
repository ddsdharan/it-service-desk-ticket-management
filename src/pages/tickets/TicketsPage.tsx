import { Plus, Ticket as TicketIcon, Inbox } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import LoadingState from "../../components/common/LoadingState";
import TicketFilters from "../../components/tickets/TicketFilters";
import TicketPagination from "../../components/tickets/TicketPagination";
import TicketTable from "../../components/tickets/TicketTable";

import { useAuth } from "../../hooks/useAuth";
import { usePermissions } from "../../hooks/usePermissions";
import { useTickets } from "../../hooks/useTickets";
import { useTicketFilters } from "../../hooks/useTicketFilters";

import { userService } from "../../services/userService";
import { categoryService } from "../../services/categoryService";

import type { User } from "../../types/user";
import type { Category } from "../../types/category";

export default function TicketsPage() {
  const { user } = useAuth();
  const { can } = usePermissions();

  const {
    data: tickets = [],
    isLoading: isTicketsLoading,
    isError: isTicketsError,
    refetch: refetchTickets,
  } = useTickets();

  const {
    data: users = [],
    isLoading: isUsersLoading,
    isError: isUsersError,
    refetch: refetchUsers,
  } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: userService.getUsers,
    staleTime: 30_000,
    retry: 1,
  });

  const {
    data: categories = [],
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
    refetch: refetchCategories,
  } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: categoryService.getCategories,
    staleTime: 30_000,
    retry: 1,
  });

  const isLoading =
    isTicketsLoading ||
    isUsersLoading ||
    isCategoriesLoading;

  const isError =
    isTicketsError ||
    isUsersError ||
    isCategoriesError;

  const visibleTickets = tickets.filter((ticket) => {
    if (!user) {
      return false;
    }

    // Admin
    if (can("tickets:view_all")) {
      return true;
    }

    // Support Agent
    if (can("tickets:view_assigned")) {
      return ticket.assignedAgent === user.id;
    }

    // Employee
    if (can("tickets:view_own")) {
      return ticket.createdBy === user.id;
    }

    return false;
  });

  const userNames = users.reduce<Record<string, string>>(
    (result, current: User) => {
      result[current.id] = current.fullName;
      return result;
    },
    {},
  );

  const categoryNames = categories.reduce<Record<string, string>>(
    (result, current: Category) => {
      result[current.id] = current.name;
      return result;
    },
    {},
  );

  const {
    filters,
    filteredTickets,
    paginatedTickets,
    currentPage,
    totalPages,
    pageSize,
    goToPage,
    updateFilter,
    resetFilters,
  } = useTicketFilters(visibleTickets, userNames);

  const supportAgents = users.filter(
    (item) => item.role === "support_agent",
  );

  const handleRetry = async () => {
    await Promise.all([
      isTicketsError ? refetchTickets() : Promise.resolve(),
      isUsersError ? refetchUsers() : Promise.resolve(),
      isCategoriesError
        ? refetchCategories()
        : Promise.resolve(),
    ]);
  };

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <LoadingState rows={6} />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <ErrorState
            title="Unable to load tickets"
            message="The ticket service or supporting data could not be reached. Please check that JSON Server is running and try again."
            onRetry={handleRetry}
            retryLabel="Retry"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Page Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">
              Service Desk
            </p>

            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Tickets
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              {can("tickets:view_all")
                ? "Manage and monitor all service desk tickets."
                : can("tickets:view_assigned")
                  ? "View and manage tickets assigned to you."
                  : "View and manage your service requests."}
            </p>
          </div>

          {can("tickets:create") && (
            <Link
              to="/app/tickets/new"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
            >
              <Plus className="h-4 w-4" />
              Create Ticket
            </Link>
          )}
        </div>

        {/* Ticket Summary */}
        <div className="mb-5 flex items-center gap-2 text-sm text-slate-500">
          <TicketIcon className="h-4 w-4" />

          <span>
            Showing{" "}
            <span className="font-medium text-slate-900">
              {filteredTickets.length}
            </span>{" "}
            of{" "}
            <span className="font-medium text-slate-900">
              {visibleTickets.length}
            </span>{" "}
            tickets
          </span>
        </div>

        {/* Filters */}
        <div className="mb-5">
          <TicketFilters
            filters={filters}
            categories={categories}
            agents={supportAgents}
            onChange={updateFilter}
            onReset={resetFilters}
          />
        </div>

        {/* Empty State */}
        {visibleTickets.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="No tickets found"
            message={
              can("tickets:view_all")
                ? "There are no service desk tickets available yet."
                : can("tickets:view_assigned")
                  ? "There are no tickets currently assigned to you."
                  : "You have not created any service desk tickets yet."
            }
            action={
              can("tickets:create") ? (
                <Link
                  to="/app/tickets/new"
                  className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
                >
                  <Plus className="h-4 w-4" />
                  Create Ticket
                </Link>
              ) : undefined
            }
          />
        ) : filteredTickets.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="No matching tickets"
            message="No tickets match the current search and filter criteria. Try adjusting your filters or clearing the search."
            action={
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Clear filters
              </button>
            }
          />
        ) : (
          <>
            {/* Ticket Table */}
            <TicketTable
              tickets={paginatedTickets}
              userNames={userNames}
              categoryNames={categoryNames}
            />

            {/* Pagination */}
            <TicketPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredTickets.length}
              pageSize={pageSize}
              onPageChange={goToPage}
            />
          </>
        )}
      </div>
    </div>
  );
}