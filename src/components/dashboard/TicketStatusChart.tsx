import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import type { Ticket } from "../../types/ticket";

interface TicketStatusChartProps {
  tickets: Ticket[];
}

const statusLabels: Record<string, string> = {
  open: "Open",
  assigned: "Assigned",
  in_progress: "In Progress",
  pending: "Pending",
  resolved: "Resolved",
  closed: "Closed",
  cancelled: "Cancelled",
  reopened: "Reopened",
};

const statusColors: Record<string, string> = {
  open: "#6366f1",
  assigned: "#3b82f6",
  in_progress: "#0ea5e9",
  pending: "#f59e0b",
  resolved: "#10b981",
  closed: "#22c55e",
  cancelled: "#ef4444",
  reopened: "#8b5cf6",
};

const statusOrder = [
  "open",
  "assigned",
  "in_progress",
  "pending",
  "resolved",
  "closed",
  "cancelled",
  "reopened",
];

export default function TicketStatusChart({
  tickets,
}: TicketStatusChartProps) {
  const data = statusOrder
    .map((status) => ({
      name: statusLabels[status],
      value: tickets.filter((ticket) => ticket.status === status).length,
      status,
    }))
    .filter((item) => item.value > 0);

  const total = tickets.length;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-base font-semibold text-slate-900">
          Ticket Status
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Current distribution of tickets
        </p>
      </div>

      {total === 0 ? (
        <div className="flex h-64 items-center justify-center">
          <p className="text-sm text-slate-400">
            No ticket data available
          </p>
        </div>
      ) : (
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={95}
                paddingAngle={2}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`${entry.status}-${index}`}
                    fill={statusColors[entry.status] ?? "#cbd5e1"}
                  />
                ))}
              </Pie>

              <Tooltip
                formatter={(value) => [
                  `${value} ticket${Number(value) === 1 ? "" : "s"}`,
                  "Count",
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {data.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {data.map((item) => (
            <div
              key={item.status}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
              style={{
                boxShadow: `inset 0 0 0 1px ${statusColors[item.status]}22`,
              }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: statusColors[item.status] ?? "#cbd5e1" }}
                />
                <p className="text-xs text-slate-500">{item.name}</p>
              </div>

              <p className="mt-1 text-lg font-semibold text-slate-900">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}