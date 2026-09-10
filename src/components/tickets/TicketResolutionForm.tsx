import { useState, type SubmitEvent } from "react";
import { CheckCircle2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../app/providers/toast-context";
import { ticketService } from "../../services/ticketService";
import { activityService } from "../../services/activityService";
import type { Ticket } from "../../types/ticket";

interface TicketResolutionFormProps {
  ticket: Ticket;
}

export default function TicketResolutionForm({
  ticket,
}: TicketResolutionFormProps) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const [resolution, setResolution] = useState(ticket.resolution ?? "");
  const [resolutionNotes, setResolutionNotes] = useState(
    ticket.resolutionNotes ?? "",
  );
  const [error, setError] = useState("");

  const resolveMutation = useMutation({
    mutationFn: async () => {
      if (!user) {
        throw new Error("You must be signed in to resolve this ticket.");
      }

      const trimmedResolution = resolution.trim();
      const trimmedNotes = resolutionNotes.trim();

      if (!trimmedResolution) {
        throw new Error("Resolution is required.");
      }

      if (!trimmedNotes) {
        throw new Error("Resolution notes are required.");
      }

      const now = new Date().toISOString();

      const updatedTicket = await ticketService.updateTicket(ticket.id, {
        status: "resolved",
        resolution: trimmedResolution,
        resolutionNotes: trimmedNotes,
        resolutionDate: now,
        updatedAt: now,
      });

      await activityService.createActivity({
        id: `ACT-${Date.now()}-resolution`,
        ticketId: ticket.id,
        userId: user.id,
        type: "resolved",
        message: "Resolution added",
        createdAt: now,
      });
      
      await activityService.createActivity({
        id: `ACT-${Date.now()}-resolved`,
        ticketId: ticket.id,
        userId: user.id,
        type: "resolved",
        message: "Ticket resolved",
        createdAt: new Date(Date.now() + 1).toISOString(),
      });

      return updatedTicket;
    },

    onSuccess: async () => {
      setError("");

      showToast({
        variant: "success",
        title: "Ticket resolved",
        message: "The resolution details were saved successfully.",
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

    onError: (mutationError) => {
      const message =
        mutationError instanceof Error
          ? mutationError.message
          : "Unable to resolve the ticket.";

      setError(message);

      showToast({
        variant: "error",
        title: "Ticket resolution failed",
        message,
      });
    },
  });

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    resolveMutation.mutate();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div>
        <h2 className="text-base font-semibold text-slate-900">
          Resolve Ticket
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Add the resolution details before marking this ticket as resolved.
        </p>
      </div>

      <div className="mt-5 space-y-5">
        <div>
          <label
            htmlFor="resolution"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Resolution
          </label>

          <textarea
            id="resolution"
            value={resolution}
            onChange={(event) => setResolution(event.target.value)}
            rows={4}
            maxLength={2000}
            placeholder="Describe how the issue was resolved..."
            disabled={resolveMutation.isPending}
            className="w-full resize-y rounded-lg border border-slate-300 px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
          />

          <p className="mt-1 text-right text-xs text-slate-400">
            {resolution.length}/2000
          </p>
        </div>

        <div>
          <label
            htmlFor="resolutionNotes"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Resolution Notes
          </label>

          <textarea
            id="resolutionNotes"
            value={resolutionNotes}
            onChange={(event) => setResolutionNotes(event.target.value)}
            rows={4}
            maxLength={2000}
            placeholder="Add any additional resolution notes..."
            disabled={resolveMutation.isPending}
            className="w-full resize-y rounded-lg border border-slate-300 px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
          />

          <p className="mt-1 text-right text-xs text-slate-400">
            {resolutionNotes.length}/2000
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-5 flex justify-end">
        <button
          type="submit"
          disabled={
            !resolution.trim() ||
            !resolutionNotes.trim() ||
            resolveMutation.isPending
          }
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <CheckCircle2 size={17} />

          {resolveMutation.isPending
            ? "Resolving..."
            : "Resolve Ticket"}
        </button>
      </div>
    </form>
  );
}