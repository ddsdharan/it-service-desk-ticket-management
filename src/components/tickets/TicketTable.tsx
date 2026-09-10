import { Link } from "react-router-dom";
import type { Ticket } from "../../types/ticket";
import TicketPriorityBadge from "./TicketPriorityBadge";
import TicketStatusBadge from "./TicketStatusBadge";

interface TicketTableProps {
  tickets: Ticket[];
  userNames: Record<string, string>;
  categoryNames: Record<string, string>;
}

export default function TicketTable({
  tickets,
  userNames,
  categoryNames,
}: TicketTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[950px] text-left">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Ticket
              </th>

              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Requester
              </th>

              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Category
              </th>

              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Priority
              </th>

              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Status
              </th>

              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Assigned To
              </th>

              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Updated
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {tickets.map((ticket) => (
              <tr
                key={ticket.id}
                className="transition hover:bg-slate-50"
              >
                <td className="px-5 py-4">
                  <Link
                    to={`/app/tickets/${ticket.id}`}
                    className="group"
                  >
                    <p className="text-xs font-medium text-slate-400">
                      {ticket.id}
                    </p>

                    <p className="mt-1 max-w-[260px] truncate text-sm font-medium text-slate-900 group-hover:text-slate-600">
                      {ticket.subject}
                    </p>
                  </Link>
                </td>

                <td className="px-5 py-4 text-sm text-slate-600">
                  {userNames[ticket.createdBy] ?? "Unknown"}
                </td>

                <td className="px-5 py-4 text-sm text-slate-600">
                  {categoryNames[ticket.categoryId] ?? "Unknown"}
                </td>

                <td className="px-5 py-4">
                  <TicketPriorityBadge
                    priority={ticket.priority}
                  />
                </td>

                <td className="px-5 py-4">
                  <TicketStatusBadge
                    status={ticket.status}
                  />
                </td>

                <td className="px-5 py-4 text-sm text-slate-600">
                  {ticket.assignedAgent
                    ? userNames[ticket.assignedAgent] ??
                      "Unknown"
                    : "Unassigned"}
                </td>

                <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-500">
                  {new Date(
                    ticket.updatedAt
                  ).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {tickets.length === 0 && (
        <div className="px-6 py-12 text-center">
          <p className="text-sm font-medium text-slate-700">
            No tickets found
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Try adjusting your search or filters.
          </p>
        </div>
      )}
    </div>
  );
}