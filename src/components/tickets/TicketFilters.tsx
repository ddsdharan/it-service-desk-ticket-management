import { Search, SlidersHorizontal, X } from "lucide-react";
import type {
  TicketPriority,
  TicketStatus,
} from "../../types/ticket";

export interface TicketFilterState {
  search: string;
  status: TicketStatus | "all";
  priority: TicketPriority | "all";
  categoryId: string;
  agentId: string;
  date: "",
  sort: "newest" | "oldest" | "priority" | "updated";
}

interface TicketFiltersProps {
  filters: TicketFilterState;
  categories: { id: string; name: string }[];
  agents: { id: string; fullName: string }[];
  onChange: (
    key: keyof TicketFilterState,
    value: string,
  ) => void;
  onReset: () => void;
}

export default function TicketFilters({
  filters,
  categories,
  agents,
  onChange,
  onReset,
}: TicketFiltersProps) {
  const hasFilters =
    Boolean(filters.search) ||
    filters.status !== "all" ||
    filters.priority !== "all" ||
    Boolean(filters.categoryId) ||
    Boolean(filters.agentId) ||
    Boolean(filters.date);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            type="search"
            value={filters.search}
            onChange={(event) =>
              onChange("search", event.target.value)
            }
            placeholder="Search by ticket ID, subject, employee or agent..."
            className="w-full rounded-xl border border-slate-300 bg-slate-50 py-2.5 pl-10 pr-3 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
          />
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
            <SlidersHorizontal className="h-4 w-4 text-indigo-600" />
            <span>Filters</span>
          </div>

          <div className="grid w-full gap-3 grid-cols-1 sm:grid-cols-2 xl:grid-cols-6">
            <select
              value={filters.status}
              onChange={(event) =>
                onChange("status", event.target.value)
              }
              className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            >
              <option value="all">All statuses</option>
              <option value="assigned">Assigned</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
              <option value="cancelled">Cancelled</option>
              <option value="reopened">Reopened</option>
            </select>

            <select
              value={filters.priority}
              onChange={(event) =>
                onChange("priority", event.target.value)
              }
              className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            >
              <option value="all">All priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>

            <select
              value={filters.categoryId}
              onChange={(event) =>
                onChange("categoryId", event.target.value)
              }
              className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            >
              <option value="">All categories</option>

              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <select
              value={filters.agentId}
              onChange={(event) =>
                onChange("agentId", event.target.value)
              }
              className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            >
              <option value="">All agents</option>

              {agents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.fullName}
                </option>
              ))}
            </select>

            <select
              value={filters.date}
              onChange={(event) =>
                onChange("date", event.target.value)
              }
              className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            >
              <option value="">All dates</option>
              <option value="today">Today</option>
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
            </select>

            <select
              value={filters.sort}
              onChange={(event) =>
                onChange("sort", event.target.value)
              }
              className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="priority">Highest priority</option>
              <option value="updated">Recently updated</option>
            </select>
          </div>

          {hasFilters && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center justify-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
            >
              <X className="h-4 w-4" />
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
}