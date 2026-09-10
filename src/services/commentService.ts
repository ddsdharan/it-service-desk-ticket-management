import { api } from "./api";
import type { Comment } from "../types/comment";

export const commentService = {
  getCommentsByTicket: async (
    ticketId: string,
  ): Promise<Comment[]> => {
    const response = await api.get<Comment[]>("/comments");

    return response.data
      .filter((comment) => comment.ticketId === ticketId)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() -
          new Date(b.createdAt).getTime(),
      );
  },

  createComment: async (
    comment: Comment,
  ): Promise<Comment> => {
    const response = await api.post<Comment>(
      "/comments",
      comment,
    );

    return response.data;
  },
};