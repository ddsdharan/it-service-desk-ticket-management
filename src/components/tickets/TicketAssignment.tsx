import { useState } from "react";
import { UserRound } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useToast } from "../../app/providers/toast-context";

import { api } from "../../services/api";
import { ticketService } from "../../services/ticketService";

import type { User } from "../../types/user";
import type { Ticket } from "../../types/ticket";

import { useAuth } from "../../hooks/useAuth";
import { activityService } from "../../services/activityService";

interface TicketAssignmentProps {
  ticket: Ticket;
  canAssign: boolean;
}

const createActivityId = () =>
  `ACT-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export default function TicketAssignment({
  ticket,
  canAssign,
}: TicketAssignmentProps) {
  const queryClient = useQueryClient();

  const { showToast } = useToast();

  const [selectedAgent, setSelectedAgent] = useState(
    ticket.assignedAgent ?? "",
  );

  const [error, setError] = useState("");

  const usersQuery = useQuery({
    queryKey: ["support-agents"],
    queryFn: async () => {
      const response = await api.get<User[]>(
        "/users?role=support_agent&status=active",
      );

      return response.data;
    },
    enabled: canAssign,
    staleTime: 60_000,
  });

  const { user } = useAuth();

  const assignmentMutation = useMutation({
  mutationFn: async (
    agentId: string | null,
  ) => {
    if (!user) {
      throw new Error(
        "You must be signed in to assign a ticket.",
      );
    }

    const previousAgentId =
      ticket.assignedAgent;

    const updatedTicket =
      await ticketService.assignTicket(
        ticket.id,
        agentId,
      );

    const previousAgent = agents.find(
      (agent) => agent.id === previousAgentId,
    );

    const nextAgent = agents.find(
      (agent) => agent.id === agentId,
    );

    const activityType =
      !agentId
        ? "unassigned"
        : previousAgentId
          ? "reassigned"
          : "assigned";

    const message =
      !agentId
        ? `Ticket unassigned from ${previousAgent?.fullName ?? "agent"}`
        : previousAgentId
          ? `Ticket reassigned from ${
              previousAgent?.fullName ?? "agent"
            } to ${nextAgent?.fullName ?? "agent"}`
          : `Ticket assigned to ${
              nextAgent?.fullName ?? "agent"
            }`;

    await activityService.createActivity({
      id: createActivityId(),
      ticketId: ticket.id,
      userId: user.id,
      type: activityType,
      message,
      createdAt: new Date().toISOString(),
    });

    return updatedTicket;
  },
  onSuccess: async (updatedTicket) => {
  setError("");
  setSelectedAgent(updatedTicket.assignedAgent ?? "");

  const action =
    ticket.assignedAgent && updatedTicket.assignedAgent
      ? "reassigned"
      : updatedTicket.assignedAgent
        ? "assigned"
        : "unassigned";

  showToast({
    variant: "success",
    title:
      action === "assigned"
        ? "Ticket assigned"
        : action === "reassigned"
          ? "Ticket reassigned"
          : "Ticket unassigned",
    message:
      action === "assigned"
        ? "The ticket has been assigned successfully."
        : action === "reassigned"
          ? "The ticket has been reassigned successfully."
          : "The ticket has been unassigned successfully.",
  });

  await Promise.all([
    queryClient.invalidateQueries({
      queryKey: ["ticket", ticket.id],
    }),
    queryClient.invalidateQueries({
      queryKey: ["tickets"],
    }),
    queryClient.invalidateQueries({
      queryKey: ["ticket-activities", ticket.id],
    }),
  ]);
},

onError: (error) => {
  const message =
    error instanceof Error
      ? error.message
      : "Unable to update ticket assignment.";

  setError(message);

  showToast({
    variant: "error",
    title: "Assignment failed",
    message,
  });
},
});

  if (!canAssign) {
    return null;
  }

  const agents = usersQuery.data ?? [];

  const handleAssignment = () => {
    assignmentMutation.mutate(
      selectedAgent || null,
    );
  };

  const hasChanged =
    selectedAgent !== (ticket.assignedAgent ?? "");

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
          <UserRound size={18} />
        </div>

        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Assignment
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Assign or reassign this ticket to a support agent.
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <select
          value={selectedAgent}
          onChange={(event) =>
            setSelectedAgent(event.target.value)
          }
          disabled={
            usersQuery.isLoading ||
            assignmentMutation.isPending
          }
          className="min-h-11 flex-1 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
        >
          <option value="">
            Unassigned
          </option>

          {agents.map((agent) => (
            <option key={agent.id} value={agent.id}>
              {agent.fullName}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={handleAssignment}
          disabled={
            !hasChanged ||
            usersQuery.isLoading ||
            assignmentMutation.isPending
          }
          className="min-h-11 rounded-lg bg-slate-900 px-5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {assignmentMutation.isPending
            ? "Saving..."
            : "Save Assignment"}
        </button>
      </div>

      {usersQuery.isLoading && (
        <p className="mt-3 text-xs text-slate-500">
          Loading support agents...
        </p>
      )}

      {usersQuery.isError && (
        <p className="mt-3 text-xs text-red-600">
          Unable to load support agents.
        </p>
      )}
    </section>
  );
}