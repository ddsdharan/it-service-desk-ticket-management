import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import type { Ticket } from "../../types/ticket";

interface TicketPriorityChartProps {
  tickets: Ticket[];
}

const priorityLabels: Record<string, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

const priorityColors: Record<string, string> = {
  low: "#22c55e",
  medium: "#f59e0b",
  high: "#f97316",
  critical: "#ef4444",
};

const priorityOrder = [
  "critical",
  "high",
  "medium",
  "low",
];

export default function TicketPriorityChart({
  tickets,
}: TicketPriorityChartProps) {
  const data = priorityOrder
    .map((priority) => ({
      name: priorityLabels[priority],
      value: tickets.filter(
        (ticket) => ticket.priority === priority,
      ).length,
      priority,
    }))
    .filter((item) => item.value > 0);

  const total = tickets.length;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-base font-semibold text-slate-900">
          Ticket Priority
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Current priority distribution
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
                    key={`${entry.priority}-${index}`}
                    fill={priorityColors[entry.priority] ?? "#cbd5e1"}
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
              key={item.priority}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
              style={{
                boxShadow: `inset 0 0 0 1px ${priorityColors[item.priority]}22`,
              }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: priorityColors[item.priority] ?? "#cbd5e1" }}
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