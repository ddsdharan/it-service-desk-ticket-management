import {
  Activity,
  CheckCircle2,
  MessageSquare,
  RefreshCcw,
  UserRound,
  UserRoundPlus,
  UserRoundX,
} from "lucide-react";

import type { Comment } from "../../types/comment";
import type { TicketActivity } from "../../types/activity";
import type { User } from "../../types/user";
import EmptyState from "../common/EmptyState";

interface TimelineItem {
  id: string;
  type: "comment" | "activity";
  createdAt: string;
  userId: string;
  content: string;
  activityType?: TicketActivity["type"];
}

interface TicketActivityTimelineProps {
  comments: Comment[];
  activities: TicketActivity[];
  users: User[];
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getActivityLabel(
  type: TicketActivity["type"],
): string {
  const labels: Record<TicketActivity["type"], string> = {
    created: "Ticket created",
    comment: "Comment added",
    assigned: "Ticket assigned",
    reassigned: "Ticket reassigned",
    unassigned: "Ticket unassigned",
    status_changed: "Status changed",
    priority_changed: "Priority changed",
    resolved: "Ticket resolved",
    reopened: "Ticket reopened",
  };

  return labels[type];
}

function ActivityIcon({
  type,
}: {
  type: TicketActivity["type"];
}) {
  switch (type) {
    case "assigned":
    case "reassigned":
      return <UserRoundPlus size={16} />;

    case "unassigned":
      return <UserRoundX size={16} />;

    case "resolved":
      return <CheckCircle2 size={16} />;

    case "reopened":
      return <RefreshCcw size={16} />;

    case "status_changed":
    case "priority_changed":
      return <Activity size={16} />;

    case "created":
    default:
      return <UserRound size={16} />;
  }
}

export default function TicketActivityTimeline({
  comments,
  activities,
  users,
}: TicketActivityTimelineProps) {
  const timeline: TimelineItem[] = [
    ...comments.map((comment) => ({
      id: `comment-${comment.id}`,
      type: "comment" as const,
      createdAt: comment.createdAt,
      userId: comment.userId,
      content: comment.content,
    })),

    ...activities.map((activity) => ({
      id: `activity-${activity.id}`,
      type: "activity" as const,
      createdAt: activity.createdAt,
      userId: activity.userId,
      content: activity.message,
      activityType: activity.type,
    })),
  ].sort(
    (a, b) =>
      new Date(a.createdAt).getTime() -
      new Date(b.createdAt).getTime(),
  );

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div>
        <h2 className="text-base font-semibold text-slate-900">
          Activity & Comments
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Comments and ticket activity history.
        </p>
      </div>

      {timeline.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="No activity yet"
            message="Comments and ticket activity will appear here."
            icon={MessageSquare}
          />
        </div>
      ) : (
        <div className="mt-6">
          {timeline.map((item, index) => {
            const user = users.find(
              (currentUser) =>
                currentUser.id === item.userId,
            );

            const isComment = item.type === "comment";
            const isLast = index === timeline.length - 1;

            return (
              <div
                key={item.id}
                className="relative flex gap-3 sm:gap-4"
              >
                {!isLast && (
                  <div
                    className="absolute left-[17px] top-9 bottom-0 w-px bg-slate-200"
                    aria-hidden="true"
                  />
                )}

                <div
                  className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                    isComment
                      ? "bg-blue-50 text-blue-600"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {isComment ? (
                    <MessageSquare
                      size={16}
                      aria-hidden="true"
                    />
                  ) : (
                    <ActivityIcon
                      type={
                        item.activityType ?? "created"
                      }
                    />
                  )}
                </div>

                <div
                  className={`min-w-0 flex-1 ${
                    isLast ? "pb-0" : "pb-7"
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <p className="text-sm font-medium text-slate-900">
                      {user?.fullName ?? "Unknown User"}
                    </p>

                    {!isComment &&
                      item.activityType && (
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">
                          {getActivityLabel(
                            item.activityType,
                          )}
                        </span>
                      )}

                    <span className="text-xs text-slate-400">
                      {formatDate(item.createdAt)}
                    </span>
                  </div>

                  {isComment ? (
                    <div className="mt-2 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                      <div className="flex items-start gap-2">
                        <MessageSquare
                          className="mt-1 h-4 w-4 shrink-0 text-slate-400"
                          aria-hidden="true"
                        />

                        <p className="min-w-0 whitespace-pre-wrap">
                          {item.content}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {item.content}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}