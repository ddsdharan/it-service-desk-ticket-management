import { useState, type SubmitEvent } from "react";
import { Send } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../app/providers/toast-context";
import { commentService } from "../../services/commentService";
import { activityService } from "../../services/activityService";

import type { Comment } from "../../types/comment";

interface TicketCommentFormProps {
  ticketId: string;
}

export default function TicketCommentForm({
  ticketId,
}: TicketCommentFormProps) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  const commentMutation = useMutation({
    mutationFn: async () => {
      const trimmedContent = content.trim();

      if (!trimmedContent) {
        throw new Error("Comment cannot be empty.");
      }

      if (!user) {
        throw new Error(
          "You must be signed in to add a comment.",
        );
      }

      const now = new Date().toISOString();

const newComment: Comment = {
  id: `COM-${Date.now()}`,
  ticketId,
  userId: user.id,
  content: trimmedContent,
  createdAt: now,
};

const createdComment =
  await commentService.createComment(newComment);

await activityService.createActivity({
  id: `ACT-${Date.now()}`,
  ticketId,
  userId: user.id,
  type: "comment",
  message: "Added a comment",
  createdAt: now,
});

return createdComment;
    },

    onSuccess: async () => {
      setContent("");
      setError("");

      showToast({
        variant: "success",
        title: "Comment added",
        message: "Your comment was added to the ticket.",
      });

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["ticket-comments", ticketId],
        }),
        queryClient.invalidateQueries({
          queryKey: ["ticket-activities", ticketId],
        }),
      ]);
    },

    onError: (mutationError) => {
      const message =
        mutationError instanceof Error
          ? mutationError.message
          : "Unable to add comment.";

      setError(message);

      showToast({
        variant: "error",
        title: "Comment failed",
        message,
      });
    },
  });

  const handleSubmit = (
    event: SubmitEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setError("");
    commentMutation.mutate();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h2 className="text-base font-semibold text-slate-900">
        Add Comment
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        Add an update or additional information to this ticket.
      </p>

      <textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        rows={5}
        maxLength={2000}
        placeholder="Write your comment..."
        disabled={commentMutation.isPending}
        className="mt-5 w-full resize-y rounded-lg border border-slate-300 px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
      />

      {error && (
        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-slate-400">
          {content.length}/2000
        </span>

        <button
          type="submit"
          disabled={
            !content.trim() ||
            commentMutation.isPending
          }
          className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send size={16} />

          {commentMutation.isPending
            ? "Adding..."
            : "Add Comment"}
        </button>
      </div>
    </form>
  );
}