import type { ReactNode } from "react";

import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  FolderOpen,
  Inbox,
  ListTodo,
  Ticket,
  Timer,
  UserCheck,
  XCircle,
} from "lucide-react";

import StatCard from "../../components/dashboard/StatCard";
import TicketPriorityChart from "../../components/dashboard/TicketPriorityChart";
import TicketStatusChart from "../../components/dashboard/TicketStatusChart";
import { useAuth } from "../../hooks/useAuth";
import { useDashboardStats } from "../../hooks/useDashboardStats";

export default function DashboardPage() {
  const { user } = useAuth();

  const {
    adminStats,
    agentStats,
    employeeStats,
    visibleTickets,
    isLoading,
    isError,
    refetch,
  } = useDashboardStats();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <h2 className="font-semibold text-red-800">
            Unable to load dashboard
          </h2>

          <p className="mt-1 text-sm text-red-600">
            We couldn't retrieve the latest ticket statistics.
          </p>

          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <p className="text-sm font-medium text-indigo-600">
          Overview
        </p>

        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Dashboard
        </h1>

        <p className="mt-2 text-sm text-slate-500 sm:text-base">
          Welcome back, {user?.fullName}. Here's what's happening
          with your service desk.
        </p>
      </div>

      {user?.role === "admin" && (
        <DashboardSection title="Ticket Overview">
          <StatCard
            title="Total Tickets"
            value={adminStats.total}
            icon={Ticket}
          />

          <StatCard
            title="Open"
            value={adminStats.open}
            icon={Inbox}
          />

          <StatCard
            title="Assigned"
            value={adminStats.assigned}
            icon={UserCheck}
          />

          <StatCard
            title="In Progress"
            value={adminStats.inProgress}
            icon={Timer}
          />

          <StatCard
            title="Pending"
            value={adminStats.pending}
            icon={Clock3}
          />

          <StatCard
            title="Resolved"
            value={adminStats.resolved}
            icon={CheckCircle2}
          />

          <StatCard
            title="Closed"
            value={adminStats.closed}
            icon={FolderOpen}
          />

          <StatCard
            title="Critical"
            value={adminStats.critical}
            icon={AlertTriangle}
          />

          <StatCard
            title="Unassigned"
            value={adminStats.unassigned}
            icon={XCircle}
          />
        </DashboardSection>
      )}

      {user?.role === "support_agent" && (
        <DashboardSection title="My Workload">
          <StatCard
            title="My Assigned"
            value={agentStats.assigned}
            icon={Ticket}
          />

          <StatCard
            title="New"
            value={agentStats.new}
            icon={Inbox}
          />

          <StatCard
            title="In Progress"
            value={agentStats.inProgress}
            icon={Timer}
          />

          <StatCard
            title="Pending"
            value={agentStats.pending}
            icon={Clock3}
          />

          <StatCard
            title="Resolved"
            value={agentStats.resolved}
            icon={CheckCircle2}
          />

          <StatCard
            title="High Priority"
            value={agentStats.highPriority}
            icon={AlertTriangle}
          />
        </DashboardSection>
      )}

      {user?.role === "employee" && (
        <DashboardSection title="My Requests">
          <StatCard
            title="My Total"
            value={employeeStats.total}
            icon={ListTodo}
          />

          <StatCard
            title="Open"
            value={employeeStats.open}
            icon={Inbox}
          />

          <StatCard
            title="In Progress"
            value={employeeStats.inProgress}
            icon={Timer}
          />

          <StatCard
            title="Resolved"
            value={employeeStats.resolved}
            icon={CheckCircle2}
          />

          <StatCard
            title="Closed"
            value={employeeStats.closed}
            icon={FolderOpen}
          />
        </DashboardSection>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <TicketStatusChart tickets={visibleTickets} />
        <TicketPriorityChart tickets={visibleTickets} />
      </div>
    </div>
  );
}

interface DashboardSectionProps {
  title: string;
  children: ReactNode;
}

function DashboardSection({
  title,
  children,
}: DashboardSectionProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
          {title}
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-3">
        {children}
      </div>
    </section>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6 pb-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
        <div className="mt-3 h-8 w-48 animate-pulse rounded bg-slate-200" />
        <div className="mt-3 h-4 w-80 max-w-full animate-pulse rounded bg-slate-200" />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-32 animate-pulse rounded-2xl border border-slate-200 bg-white"
          />
        ))}
      </div>
    </div>
  );
}