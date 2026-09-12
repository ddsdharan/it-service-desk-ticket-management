import { NavLink } from "react-router-dom";
import { LogOut, X } from "lucide-react";

import { navigationItems } from "../../constants/navigation";
import { usePermissions } from "../../hooks/usePermissions";
import { useAuth } from "../../hooks/useAuth";

interface SidebarProps {
  mobile?: boolean;
  onClose?: () => void;
}

export default function Sidebar({
  mobile = false,
  onClose,
}: SidebarProps) {
  const { can } = usePermissions();
  const { user, logout } = useAuth();

  const visibleItems = navigationItems.filter((item) => {
    if (!item.permission) {
      return true;
    }

    return can(item.permission);
  });

  function handleLogout() {
    logout();
  }

  return (
    <aside
      className={`flex h-screen w-72 flex-col border-r border-indigo-900/40 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100 shadow-[10px_0_30px_rgba(79,70,229,0.12)] ${
        mobile
          ? "fixed left-0 top-0 z-50 flex"
          : "fixed left-0 top-0 z-30 hidden lg:flex"
      }`}
    >
      <div className="flex h-20 items-center justify-between border-b border-slate-800/80 px-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-sky-500 text-sm font-bold text-white shadow-lg shadow-indigo-500/30">
            IT
          </div>

          <div>
            <p className="text-sm font-semibold text-white">
              Service Desk
            </p>

            <p className="text-xs text-indigo-200/80">
              IT Management
            </p>
          </div>
        </div>

        {mobile && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <nav
        className="flex-1 overflow-y-auto px-3 py-5"
        aria-label="Main navigation"
      >
        <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
          Workspace
        </p>

        <div className="space-y-1.5">
          {visibleItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-500/20"
                      : "text-slate-300 hover:bg-indigo-500/10 hover:text-white",
                  ].join(" ")
                }
              >
                <Icon className="h-4 w-4 shrink-0" />

                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      <div className="border-t border-slate-800 p-3">
        <div className="mb-3 rounded-2xl border border-indigo-500/20 bg-gradient-to-r from-slate-900 via-indigo-950/20 to-slate-900 px-3 py-3">
          <p className="truncate text-sm font-medium text-white">
            {user?.fullName}
          </p>

          <p className="mt-1 truncate text-xs text-slate-400">
            {user?.email}
          </p>

          <p className="mt-2 inline-flex rounded-full bg-slate-800 px-2.5 py-1 text-[10px] font-medium capitalize text-slate-200 ring-1 ring-slate-700">
            {user?.role.replace("_", " ")}
          </p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-red-500/10 hover:text-red-300"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}