import type { ReactNode } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Mail,
  Phone,
  UserRound,
  Trash2,
} from "lucide-react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { useAuth } from "../../hooks/useAuth";
import { useTicket } from "../../hooks/useTicket";
import { useTicketActivity } from "../../hooks/useTicketActivity";
import { useToast } from "../../app/providers/toast-context";

import { ticketService } from "../../services/ticketService";
import { activityService } from "../../services/activityService";
import { api } from "../../services/api";

import TicketStatusBadge from "../../components/tickets/TicketStatusBadge";
import TicketPriorityBadge from "../../components/tickets/TicketPriorityBadge";
import TicketStatusActions from "../../components/tickets/TicketStatusActions";
import TicketAssignment from "../../components/tickets/TicketAssignment";
import TicketCommentForm from "../../components/tickets/TicketCommentForm";
import TicketActivityTimeline from "../../components/tickets/TicketActivityTimeline";
import TicketResolutionForm from "../../components/tickets/TicketResolutionForm";

import LoadingState from "../../components/common/LoadingState";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";

import type { User } from "../../types/user";
import type { Category } from "../../types/category";
import type {
  TicketStatus,
  TicketPriority,
} from "../../types/ticket";

import {
  canChangeTicketStatus,
  getAllowedNextStatuses,
} from "../../utils/ticketLifecycle";

const formatDate = (
  value: string | null | undefined,
) => {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

export default function TicketDetailsPage() {
  const { ticketId } = useParams<{
    ticketId: string;
  }>();

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { user } = useAuth();
  const { showToast } = useToast();

  const {
    data: ticket,
    isLoading: ticketLoading,
    isError: ticketError,
    refetch: refetchTicket,
  } = useTicket(ticketId);

  const usersQuery = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await api.get<User[]>("/users");
      return response.data;
    },
    staleTime: 60_000,
    retry: 1,
  });

  const categoriesQuery = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const response =
        await api.get<Category[]>("/categories");

      return response.data;
    },
    staleTime: 60_000,
    retry: 1,
  });

  const {
    comments,
    activities,
    isLoading: activityLoading,
    isError: activityError,
  } = useTicketActivity(ticketId);

  const updateStatusMutation = useMutation({
    mutationFn: async (
      status: TicketStatus,
    ) => {
      if (!ticket || !user) {
        throw new Error(
          "Unable to update the ticket.",
        );
      }

      const isAssignedAgent =
        ticket.assignedAgent === user.id;

      const isRequester =
        ticket.createdBy === user.id;

      const allowed =
        canChangeTicketStatus({
          role: user.role,
          currentStatus: ticket.status,
          nextStatus: status,
          isAssignedAgent,
          isRequester,
        });

      if (!allowed) {
        throw new Error(
          "You are not allowed to perform this status change.",
        );
      }

      if (status === "resolved") {
        throw new Error(
          "Please provide resolution details before resolving the ticket.",
        );
      }

      const previousStatus =
        ticket.status;

      const now =
        new Date().toISOString();

      const updatedTicket =
        await ticketService.updateTicket(
          ticket.id,
          {
            status,
            updatedAt: now,
          },
        );

      await activityService.createActivity({
        id: `ACT-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 8)}`,
        ticketId: ticket.id,
        userId: user.id,
        type:
          status === "reopened"
            ? "reopened"
            : "status_changed",
        message: `Status changed from ${previousStatus} to ${status}`,
        createdAt: now,
      });

      return updatedTicket;
    },

    onSuccess: async () => {
      showToast({
        variant: "success",
        title: "Status updated",
        message:
          "The ticket status was updated successfully.",
      });

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["ticket", ticketId],
        }),

        queryClient.invalidateQueries({
          queryKey: ["tickets"],
        }),

        queryClient.invalidateQueries({
          queryKey: [
            "ticket-activities",
            ticketId,
          ],
        }),
      ]);
    },

    onError: (error) => {
      showToast({
        variant: "error",
        title: "Status update failed",
        message:
          error instanceof Error
            ? error.message
            : "Unable to update the ticket status.",
      });
    },
  });

  const updatePriorityMutation =
    useMutation({
      mutationFn: async (
        priority: TicketPriority,
      ) => {
        if (!ticket || !user) {
          throw new Error(
            "Unable to update ticket priority.",
          );
        }

        const isAllowed =
          canChangePriorityForAuthUser(
            ticket,
            user,
          );

        if (!isAllowed) {
          throw new Error(
            "You are not allowed to change this ticket priority.",
          );
        }

        const previousPriority =
          ticket.priority;

        const now =
          new Date().toISOString();

        const updatedTicket =
          await ticketService.updateTicket(
            ticket.id,
            {
              priority,
              updatedAt: now,
            },
          );

        await activityService.createActivity({
          id: `ACT-${Date.now()}-${Math.random()
            .toString(36)
            .slice(2, 8)}`,
          ticketId: ticket.id,
          userId: user.id,
          type: "priority_changed",
          message: `Priority changed from ${previousPriority} to ${priority}`,
          createdAt: now,
        });

        return updatedTicket;
      },

      onSuccess: async () => {
        showToast({
          variant: "info",
          title: "Priority updated",
          message:
            "The ticket priority was updated successfully.",
        });

        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: ["ticket", ticketId],
          }),

          queryClient.invalidateQueries({
            queryKey: ["tickets"],
          }),

          queryClient.invalidateQueries({
            queryKey: [
              "ticket-activities",
              ticketId,
            ],
          }),
        ]);
      },

      onError: (error) => {
        showToast({
          variant: "error",
          title: "Priority update failed",
          message:
            error instanceof Error
              ? error.message
              : "Unable to update the ticket priority.",
        });
      },
    });

  const deleteTicketMutation =
    useMutation({
      mutationFn: async () => {
        if (!ticket || !user) {
          throw new Error(
            "Unable to delete the ticket.",
          );
        }

        if (user.role !== "admin") {
          throw new Error(
            "You are not allowed to delete tickets.",
          );
        }

        await ticketService.deleteTicket(
          ticket.id,
        );
      },

      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ["tickets"],
        });

        showToast({
          variant: "success",
          title: "Ticket deleted",
          message:
            "The ticket was deleted successfully.",
        });

        navigate("/app/tickets", {
          replace: true,
          state: {
            success:
              "Ticket deleted successfully.",
          },
        });
      },

      onError: (error) => {
        showToast({
          variant: "error",
          title: "Ticket deletion failed",
          message:
            error instanceof Error
              ? error.message
              : "Unable to delete the ticket.",
        });
      },
    });

  /*
   * Ticket loading state
   */
  if (ticketLoading) {
    return (
      <LoadingState
        message="Loading ticket details..."
        fullHeight
      />
    );
  }

  /*
   * Ticket error state
   */
  if (ticketError || !ticket) {
    return (
      <ErrorState
        title="Ticket unavailable"
        message="The requested ticket could not be loaded. Please try again or return to the ticket list."
        onRetry={() => {
          void refetchTicket();
        }}
        retryLabel="Retry"
      />
    );
  }

  const users = usersQuery.data ?? [];
  const categories =
    categoriesQuery.data ?? [];

  const requester = users.find(
    (item) =>
      item.id === ticket.createdBy,
  );

  const assignedAgent = users.find(
    (item) =>
      item.id === ticket.assignedAgent,
  );

  const category = categories.find(
    (item) =>
      item.id === ticket.categoryId,
  );

  const isAssignedAgent =
    ticket.assignedAgent === user?.id;

  const isRequester =
    ticket.createdBy === user?.id;

  const hasTicketViewAccess =
    user?.role === "admin" ||
    (user?.role === "support_agent" &&
      isAssignedAgent) ||
    (user?.role === "employee" &&
      isRequester);

  const canPriority =
    canChangePriorityForAuthUser(
      ticket,
      user,
    );

  const canAssign =
    user?.role === "admin";

  const canDelete =
    user?.role === "admin";

  const canResolve =
    canAddResolutionForAuthUser(
      ticket,
      user,
    );

  const allowedStatuses = user
    ? getAllowedNextStatuses(
        ticket.status,
        user.role,
        isAssignedAgent,
        isRequester,
      )
    : [];

  const handleStatusChange = (
    status: TicketStatus,
  ) => {
    if (!user) {
      return;
    }

    const allowed =
      canChangeTicketStatus({
        role: user.role,
        currentStatus: ticket.status,
        nextStatus: status,
        isAssignedAgent,
        isRequester,
      });

    if (!allowed) {
      showToast({
        variant: "warning",
        title: "Status change unavailable",
        message:
          "You are not allowed to perform this status change.",
      });

      return;
    }

    if (status === "resolved") {
      showToast({
        variant: "warning",
        title: "Resolution details required",
        message:
          "Add resolution details before resolving the ticket.",
      });

      return;
    }

    updateStatusMutation.mutate(status);
  };

  const handlePriorityChange = (
    priority: TicketPriority,
  ) => {
    if (!canPriority) {
      showToast({
        variant: "warning",
        title: "Priority change unavailable",
        message:
          "You are not allowed to change the ticket priority.",
      });

      return;
    }

    if (priority === ticket.priority) {
      return;
    }

    updatePriorityMutation.mutate(
      priority,
    );
  };

  const handleDelete = () => {
    if (!canDelete) {
      showToast({
        variant: "warning",
        title: "Delete unavailable",
        message:
          "You are not allowed to delete tickets.",
      });

      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ticket ${ticket.id}? This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    deleteTicketMutation.mutate();
  };

  const handleActivityRetry = () => {
    void Promise.all([
      queryClient.invalidateQueries({
        queryKey: [
          "ticket-comments",
          ticketId,
        ],
      }),

      queryClient.invalidateQueries({
        queryKey: [
          "ticket-activities",
          ticketId,
        ],
      }),
    ]);
  };

  const isUpdating =
    updateStatusMutation.isPending ||
    updatePriorityMutation.isPending ||
    deleteTicketMutation.isPending;

  /*
   * RBAC access protection
   */
  if (!hasTicketViewAccess) {
    return (
      <ErrorState
        title="Access denied"
        message="You do not have permission to view this ticket."
        onRetry={() =>
          navigate("/app/tickets")
        }
        retryLabel="Back to Tickets"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex flex-col gap-4">
        <Link
          to="/app/tickets"
          className="inline-flex w-fit items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
        >
          <ArrowLeft size={17} />
          Back to Tickets
        </Link>

        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
          <div>
            <p className="text-sm font-semibold text-blue-600">
              {ticket.id}
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
              {ticket.subject}
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Last updated{" "}
              {formatDate(
                ticket.updatedAt,
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <TicketStatusBadge
              status={ticket.status}
            />

            <TicketPriorityBadge
              priority={ticket.priority}
            />

            {canDelete && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={
                  deleteTicketMutation.isPending
                }
                className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main information */}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Description */}

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-base font-semibold text-slate-900">
              Description
            </h2>

            <span className="text-xs text-slate-500">
              Created{" "}
              {formatDate(
                ticket.createdAt,
              )}
            </span>
          </div>

          <div className="mt-5 whitespace-pre-wrap text-sm leading-7 text-slate-700">
            {ticket.description}
          </div>
        </section>

        {/* Ticket Information */}

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">
            Ticket Information
          </h2>

          <div className="mt-5 space-y-5">
            <InfoRow
              label="Requester"
              value={
                requester?.fullName ??
                ticket.createdBy
              }
              icon={
                <UserRound size={17} />
              }
            />

            <InfoRow
              label="Assigned Agent"
              value={
                assignedAgent?.fullName ??
                "Unassigned"
              }
              icon={
                <UserRound size={17} />
              }
            />

            <InfoRow
              label="Category"
              value={
                category?.name ??
                ticket.categoryId
              }
              icon={
                <CalendarDays size={17} />
              }
            />

            <InfoRow
              label="Contact Method"
              value={
                ticket.preferredContactMethod
              }
              icon={
                ticket.preferredContactMethod ===
                "phone" ? (
                  <Phone size={17} />
                ) : (
                  <Mail size={17} />
                )
              }
            />

            <InfoRow
              label="Due Date"
              value={formatDate(
                ticket.dueDate,
              )}
              icon={
                <CalendarDays size={17} />
              }
            />
          </div>
        </section>
      </div>

      {/* Status Actions */}

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Status Actions
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Available actions depend on your
            role and the ticket lifecycle.
          </p>
        </div>

        <div className="mt-5">
          {allowedStatuses.filter(
            (status) => status !== "resolved",
          ).length > 0 ? (
            <TicketStatusActions
              role={user.role}
              currentStatus={ticket.status}
              isAssignedAgent={
                ticket.assignedAgent ===
                user.id
              }
              isRequester={
                ticket.createdBy === user.id
              }
              isUpdating={isUpdating}
              onStatusChange={
                handleStatusChange
              }
            />
          ) : (
            <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">
              No status changes are available
              for your role at this stage of the
              ticket lifecycle.
            </div>
          )}
        </div>
      </section>

      {/* Assignment */}

      {canAssign && (
        <TicketAssignment
          key={`${ticket.id}-${ticket.assignedAgent ?? ""}`}
          ticket={ticket}
          canAssign={true}
        />
      )}

      {/* Priority */}

      {canPriority && (
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">
            Priority
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Update the ticket priority when
            required.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {(
              [
                "low",
                "medium",
                "high",
                "critical",
              ] as TicketPriority[]
            ).map((priority) => (
              <button
                key={priority}
                type="button"
                disabled={isUpdating}
                onClick={() =>
                  handlePriorityChange(
                    priority,
                  )
                }
                className={`rounded-lg border px-4 py-2 text-sm font-medium capitalize transition ${
                  ticket.priority ===
                  priority
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                } disabled:cursor-not-allowed disabled:opacity-50`}
              >
                {priority}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Resolution form */}

      {canResolve && (
        <TicketResolutionForm
          ticket={ticket}
        />
      )}

      {/* Resolution details */}

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">
          Resolution
        </h2>

        {ticket.resolution ||
        ticket.resolutionNotes ? (
          <div className="mt-5 space-y-4">
            {ticket.resolution && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Resolution
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {ticket.resolution}
                </p>
              </div>
            )}

            {ticket.resolutionNotes && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Resolution Notes
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {ticket.resolutionNotes}
                </p>
              </div>
            )}

            {ticket.resolutionDate && (
              <p className="text-xs text-slate-500">
                Resolved on{" "}
                {formatDate(
                  ticket.resolutionDate,
                )}
              </p>
            )}
          </div>
        ) : (
          <div className="mt-5">
            <EmptyState
              title="No resolution recorded"
              message="Resolution details will appear here once the ticket has been resolved."
            />
          </div>
        )}
      </section>

      {/* Closure */}

      {ticket.status === "resolved" && (
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">
            Closure
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            The ticket has been resolved and can
            now be closed by an authorized user.
          </p>
        </section>
      )}

      {/* Activity */}

      {activityLoading ? (
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <LoadingState message="Loading ticket activity..." />
        </section>
      ) : activityError ? (
        <ErrorState
          title="Activity unavailable"
          message="Comments and ticket activity could not be loaded. Please try again."
          onRetry={handleActivityRetry}
          retryLabel="Retry Activity"
        />
      ) : (
        <TicketActivityTimeline
          comments={comments}
          activities={activities}
          users={users}
        />
      )}

      {/* Comments */}

      <TicketCommentForm
        ticketId={ticket.id}
      />
    </div>
  );
}

interface InfoRowProps {
  label: string;
  value: string;
  icon: ReactNode;
}

function InfoRow({
  label,
  value,
  icon,
}: InfoRowProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-slate-400">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p className="mt-1 truncate text-sm font-medium capitalize text-slate-700">
          {value}
        </p>
      </div>
    </div>
  );
}

function canChangePriorityForAuthUser(
  ticket: {
    assignedAgent: string | null;
  },
  user: {
    id: string;
    role:
      | "admin"
      | "support_agent"
      | "employee";
  } | null,
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

function canAddResolutionForAuthUser(
  ticket: {
    status: TicketStatus;
    assignedAgent: string | null;
  },
  user: {
    id: string;
    role:
      | "admin"
      | "support_agent"
      | "employee";
  } | null,
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