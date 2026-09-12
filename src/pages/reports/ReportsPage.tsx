import {
  AlertCircle,
  BarChart3,
  CheckCircle2,
  CircleDot,
  Clock3,
  FileText,
  UserCheck,
  UserRoundX,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useQuery } from "@tanstack/react-query";

import { ticketService } from "../../services/ticketService";
import { userService } from "../../services/userService";
import { categoryService } from "../../services/categoryService";

import type { TicketStatus } from "../../types/ticket";

import StatCard from "../../components/dashboard/StatCard";
import LoadingState from "../../components/common/LoadingState";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";

interface StatusChartItem {
  name: string;
  value: number;
}

interface PriorityChartItem {
  name: string;
  value: number;
}

interface CategoryChartItem {
  name: string;
  value: number;
}

interface AgentWorkloadItem {
  name: string;
  value: number;
}

const statusLabels: Record<TicketStatus, string> = {
  open: "Open",
  assigned: "Assigned",
  in_progress: "In Progress",
  pending: "Pending",
  resolved: "Resolved",
  closed: "Closed",
  cancelled: "Cancelled",
  reopened: "Reopened",
};

const priorityLabels = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

const statusColorMap: Record<string, string> = {
  Open: "#6366f1",
  Assigned: "#3b82f6",
  "In Progress": "#06b6d4",
  Pending: "#f59e0b",
  Resolved: "#10b981",
  Closed: "#22c55e",
  Cancelled: "#ef4444",
  Reopened: "#8b5cf6",
};

const priorityColorMap: Record<string, string> = {
  Low: "#22c55e",
  Medium: "#f59e0b",
  High: "#f97316",
  Critical: "#ef4444",
};

const categoryBarColors = [
  "#6366f1",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#06b6d4",
  "#f97316",
  "#22c55e",
  "#ef4444",
  "#3b82f6",
];

const agentBarColors = [
  "#4f46e5",
  "#0ea5e9",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ef4444",
  "#22c55e",
  "#f97316",
];

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
  }).format(date);
}

export default function ReportsPage() {
  const ticketsQuery = useQuery({
    queryKey: ["tickets"],
    queryFn: ticketService.getTickets,
  });

  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: userService.getUsers,
  });

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: categoryService.getCategories,
  });

  const isLoading =
    ticketsQuery.isLoading ||
    usersQuery.isLoading ||
    categoriesQuery.isLoading;

  const isError =
    ticketsQuery.isError ||
    usersQuery.isError ||
    categoriesQuery.isError;

  const tickets = ticketsQuery.data ?? [];
  const users = usersQuery.data ?? [];
  const categories = categoriesQuery.data ?? [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Reports
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Analyze service desk ticket activity and workload.
          </p>
        </div>

        <LoadingState rows={6} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Reports
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Analyze service desk ticket activity and workload.
          </p>
        </div>

        <ErrorState
          title="Unable to load reports"
          message="There was a problem loading ticket, user, or category data."
          onRetry={() => {
            void ticketsQuery.refetch();
            void usersQuery.refetch();
            void categoriesQuery.refetch();
          }}
          retryLabel="Retry"
        />
      </div>
    );
  }

  const totalTickets = tickets.length;

  const openTickets = tickets.filter(
    (ticket) => ticket.status === "open",
  ).length;

  const assignedTickets = tickets.filter(
    (ticket) => ticket.status === "assigned",
  ).length;

  const inProgressTickets = tickets.filter(
    (ticket) => ticket.status === "in_progress",
  ).length;

  const pendingTickets = tickets.filter(
    (ticket) => ticket.status === "pending",
  ).length;

  const resolvedTickets = tickets.filter(
    (ticket) => ticket.status === "resolved",
  ).length;

  const closedTickets = tickets.filter(
    (ticket) => ticket.status === "closed",
  ).length;

  const cancelledTickets = tickets.filter(
    (ticket) => ticket.status === "cancelled",
  ).length;

  const criticalTickets = tickets.filter(
    (ticket) => ticket.priority === "critical",
  ).length;

  const unassignedTickets = tickets.filter(
    (ticket) => !ticket.assignedAgent,
  ).length;

  const statusOrder: TicketStatus[] = [
    "open",
    "assigned",
    "in_progress",
    "pending",
    "resolved",
    "closed",
    "cancelled",
    "reopened",
  ];

  const statusData: StatusChartItem[] = statusOrder.map(
    (status) => ({
      name: statusLabels[status],
      value: tickets.filter(
        (ticket) => ticket.status === status,
      ).length,
    }),
  );

  const priorityData: PriorityChartItem[] = [
    "low",
    "medium",
    "high",
    "critical",
  ].map((priority) => ({
    name:
      priorityLabels[
        priority as keyof typeof priorityLabels
      ],
    value: tickets.filter(
      (ticket) => ticket.priority === priority,
    ).length,
  }));

  const categoryData: CategoryChartItem[] = categories
    .map((category) => ({
      name: category.name,
      value: tickets.filter(
        (ticket) => ticket.categoryId === category.id,
      ).length,
    }))
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value);

  const knownCategoryIds = new Set(
    categories.map((category) => category.id),
  );

  const uncategorizedCount = tickets.filter(
    (ticket) => !knownCategoryIds.has(ticket.categoryId),
  ).length;

  if (uncategorizedCount > 0) {
    categoryData.push({
      name: "Uncategorized",
      value: uncategorizedCount,
    });
  }

  const agentWorkloadData: AgentWorkloadItem[] = users
    .filter((user) => user.role === "support_agent")
    .map((agent) => ({
      name: agent.fullName,
      value: tickets.filter(
        (ticket) => ticket.assignedAgent === agent.id,
      ).length,
    }))
    .sort((a, b) => b.value - a.value);

  const recentTickets = [...tickets]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() -
        new Date(a.updatedAt).getTime(),
    )
    .slice(0, 5);

  const getUserName = (id: string | null) => {
    if (!id) {
      return "Unassigned";
    }

    return (
      users.find((user) => user.id === id)?.fullName ??
      "Unknown User"
    );
  };

  const getCategoryName = (id: string) => {
    return (
      categories.find((category) => category.id === id)
        ?.name ?? "Unknown Category"
    );
  };

  const hasChartData =
    statusData.some((item) => item.value > 0) ||
    priorityData.some((item) => item.value > 0);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
            <BarChart3 className="h-5 w-5 text-slate-700" />
          </div>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              Reports
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Analyze service desk ticket activity, priorities,
              categories, and agent workload.
            </p>
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <section className="grid gap-4 grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        <StatCard
          title="Total Tickets"
          value={totalTickets}
          icon={FileText}
          description="All service desk tickets"
        />

        <StatCard
          title="Open"
          value={openTickets}
          icon={CircleDot}
          description="Awaiting assignment"
        />

        <StatCard
          title="Assigned"
          value={assignedTickets}
          icon={UserCheck}
          description="Assigned to an agent"
        />

        <StatCard
          title="In Progress"
          value={inProgressTickets}
          icon={Clock3}
          description="Currently being worked"
        />

        <StatCard
          title="Pending"
          value={pendingTickets}
          icon={Clock3}
          description="Waiting for action"
        />

        <StatCard
          title="Resolved"
          value={resolvedTickets}
          icon={CheckCircle2}
          description="Resolution completed"
        />

        <StatCard
          title="Closed"
          value={closedTickets}
          icon={CheckCircle2}
          description="Successfully closed"
        />

        <StatCard
          title="Critical"
          value={criticalTickets}
          icon={AlertCircle}
          description="Critical priority tickets"
        />
      </section>

      {/* Additional summary */}
      <section className="grid gap-4 sm:grid-cols-2">
        <StatCard
          title="Unassigned"
          value={unassignedTickets}
          icon={UserRoundX}
          description="Tickets without an agent"
        />

        <StatCard
          title="Cancelled"
          value={cancelledTickets}
          icon={AlertCircle}
          description="Cancelled tickets"
        />
      </section>

      {/* Charts */}
      {!hasChartData ? (
        <EmptyState
          title="No report data available"
          message="Create some tickets to populate the reports and charts."
          icon={BarChart3}
        />
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          {/* Status chart */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Ticket Status Distribution
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Current distribution of tickets by lifecycle
                status.
              </p>
            </div>

            <div className="mt-6 h-[320px]">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <PieChart>
                  <Pie
                    data={statusData.filter(
                      (item) => item.value > 0,
                    )}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={105}
                    innerRadius={55}
                    paddingAngle={2}
                    label
                  >
                    {statusData
                      .filter((entry) => entry.value > 0)
                      .map((entry, index) => (
                        <Cell
                          key={`${entry.name}-${index}`}
                          fill={statusColorMap[entry.name] ?? "#cbd5e1"}
                        />
                      ))}
                  </Pie>

                  <Tooltip />

                  <Legend
                    verticalAlign="bottom"
                    height={36}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Priority chart */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Ticket Priority Distribution
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Tickets grouped by priority level.
              </p>
            </div>

            <div className="mt-6 h-[320px]">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <BarChart
                  data={priorityData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: -15,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="name" />

                  <YAxis allowDecimals={false} />

                  <Tooltip />

                  <Legend />

                  <Bar
                    dataKey="value"
                    name="Tickets"
                    radius={[6, 6, 0, 0]}
                  >
                    {priorityData.map((entry, index) => (
                      <Cell
                        key={`${entry.name}-${index}`}
                        fill={priorityColorMap[entry.name] ?? "#cbd5e1"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Category chart */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Tickets by Category
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Ticket volume across service categories.
              </p>
            </div>

            {categoryData.length === 0 ? (
              <div className="mt-6">
                <EmptyState
                  title="No category data"
                  message="No tickets are currently associated with categories."
                />
              </div>
            ) : (
              <div className="mt-6 h-[320px]">
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <BarChart
                    data={categoryData}
                    layout="vertical"
                    margin={{
                      top: 10,
                      right: 20,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis
                      type="number"
                      allowDecimals={false}
                    />

                    <YAxis
                      type="category"
                      dataKey="name"
                      width={100}
                    />

                    <Tooltip />

                    <Bar
                      dataKey="value"
                      name="Tickets"
                      radius={[0, 6, 6, 0]}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell
                          key={`${entry.name}-${index}`}
                          fill={categoryBarColors[index % categoryBarColors.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </section>

          {/* Agent workload */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Agent Workload
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Number of tickets assigned to each support agent.
              </p>
            </div>

            {agentWorkloadData.length === 0 ? (
              <div className="mt-6">
                <EmptyState
                  title="No support agents"
                  message="No active support agents are currently available."
                />
              </div>
            ) : (
              <div className="mt-6 h-[320px]">
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <BarChart
                    data={agentWorkloadData}
                    layout="vertical"
                    margin={{
                      top: 10,
                      right: 20,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis
                      type="number"
                      allowDecimals={false}
                    />

                    <YAxis
                      type="category"
                      dataKey="name"
                      width={120}
                    />

                    <Tooltip />

                    <Bar
                      dataKey="value"
                      name="Assigned Tickets"
                      radius={[0, 6, 6, 0]}
                    >
                      {agentWorkloadData.map((entry, index) => (
                        <Cell
                          key={`${entry.name}-${index}`}
                          fill={agentBarColors[index % agentBarColors.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </section>
        </div>
      )}

      {/* Recently updated tickets */}
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
          <h2 className="text-base font-semibold text-slate-900">
            Recently Updated Tickets
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            The five tickets with the most recent updates.
          </p>
        </div>

        {recentTickets.length === 0 ? (
          <div className="p-6">
            <EmptyState
              title="No tickets available"
              message="There are no tickets to display in this report."
              icon={FileText}
            />
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-slate-500">
                      {ticket.id}
                    </span>

                    <span
                      className="rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset"
                      style={{
                        backgroundColor: `${statusColorMap[statusLabels[ticket.status]] ?? "#e2e8f0"}22`,
                        color: statusColorMap[statusLabels[ticket.status]] ?? "#475569",
                        borderColor: `${statusColorMap[statusLabels[ticket.status]] ?? "#cbd5e1"}55`,
                      }}
                    >
                      {statusLabels[ticket.status]}
                    </span>
                  </div>

                  <p className="mt-1 truncate text-sm font-medium text-slate-900">
                    {ticket.subject}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {getCategoryName(ticket.categoryId)}
                    {" • "}
                    {getUserName(ticket.assignedAgent)}
                  </p>
                </div>

                <div className="shrink-0 text-left sm:text-right">
                  <p className="text-xs font-medium text-slate-500">
                    Last updated
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    {formatDate(ticket.updatedAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}