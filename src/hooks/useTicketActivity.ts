import { useQuery } from "@tanstack/react-query";

import { activityService } from "../services/activityService";
import { commentService } from "../services/commentService";

export const useTicketActivity = (
  ticketId: string | undefined,
) => {
  const commentsQuery = useQuery({
    queryKey: ["ticket-comments", ticketId],

    queryFn: () =>
      commentService.getCommentsByTicket(ticketId!),

    enabled: Boolean(ticketId),
  });

  const activitiesQuery = useQuery({
    queryKey: ["ticket-activities", ticketId],

    queryFn: () =>
      activityService.getActivitiesByTicket(ticketId!),

    enabled: Boolean(ticketId),
  });

  return {
    comments: commentsQuery.data ?? [],
    activities: activitiesQuery.data ?? [],

    isLoading:
      commentsQuery.isLoading ||
      activitiesQuery.isLoading,

    isError:
      commentsQuery.isError ||
      activitiesQuery.isError,
  };
};