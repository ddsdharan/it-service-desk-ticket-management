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
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left sm:min-w-[960px]">
          <thead className="border-b border-slate-200 bg-slate-50/80">
            <tr>
              <th className="px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500 sm:px-5 sm:text-[11px]">
                Ticket
              </th>

              <th className="px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500 sm:px-5 sm:text-[11px]">
                Requester
              </th>

              <th className="px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500 sm:px-5 sm:text-[11px]">
                Category
              </th>

              <th className="px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500 sm:px-5 sm:text-[11px]">
                Priority
              </th>

              <th className="px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500 sm:px-5 sm:text-[11px]">
                Status
              </th>

              <th className="px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500 sm:px-5 sm:text-[11px]">
                Assigned To
              </th>

              <th className="px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500 sm:px-5 sm:text-[11px]">
                Updated
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 bg-white">
            {tickets.map((ticket) => (
              <tr
                key={ticket.id}
                className="transition-colors hover:bg-slate-50"
              >
                <td className="px-3 py-3 align-top sm:px-5 sm:py-4">
                  <Link
                    to={`/app/tickets/${ticket.id}`}
                    className="group inline-block"
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400 sm:text-[11px]">
                      {ticket.id}
                    </p>

                    <p className="mt-1 max-w-[180px] truncate text-sm font-medium text-slate-900 group-hover:text-indigo-600 sm:max-w-[260px]">
                      {ticket.subject}
                    </p>
                  </Link>
                </td>

                <td className="px-3 py-3 text-sm text-slate-600 sm:px-5 sm:py-4">
                  {userNames[ticket.createdBy] ?? "Unknown"}
                </td>

                <td className="px-3 py-3 text-sm text-slate-600 sm:px-5 sm:py-4">
                  {categoryNames[ticket.categoryId] ?? "Unknown"}
                </td>

                <td className="px-3 py-3 sm:px-5 sm:py-4">
                  <TicketPriorityBadge priority={ticket.priority} />
                </td>

                <td className="px-3 py-3 sm:px-5 sm:py-4">
                  <TicketStatusBadge status={ticket.status} />
                </td>

                <td className="px-3 py-3 text-sm text-slate-600 sm:px-5 sm:py-4">
                  {ticket.assignedAgent
                    ? userNames[ticket.assignedAgent] ?? "Unknown"
                    : "Unassigned"}
                </td>

                <td className="whitespace-nowrap px-3 py-3 text-sm text-slate-500 sm:px-5 sm:py-4">
                  {new Date(ticket.updatedAt).toLocaleDateString()}
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