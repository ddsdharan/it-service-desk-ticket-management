import { api } from "./api";
import type { TicketActivity } from "../types/activity";

export const activityService = {
  getActivitiesByTicket: async (
    ticketId: string,
  ): Promise<TicketActivity[]> => {
    const response = await api.get<TicketActivity[]>("/activities");

    return response.data
      .filter((activity) => activity.ticketId === ticketId)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() -
          new Date(b.createdAt).getTime(),
      );
  },

  createActivity: async (
    activity: TicketActivity,
  ): Promise<TicketActivity> => {
    const response = await api.post<TicketActivity>(
      "/activities",
      activity,
    );

    return response.data;
  },
};