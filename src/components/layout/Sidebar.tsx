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
      className={`flex h-full w-64 flex-col border-r border-slate-200 bg-white ${
        mobile ? "" : "hidden lg:flex"
      }`}
    >
      {/* Brand */}
      <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-sm font-bold text-white">
            IT
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-900">
              Service Desk
            </p>

            <p className="text-xs text-slate-500">
              IT Management
            </p>
          </div>
        </div>

        {mobile && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav
        className="flex-1 overflow-y-auto px-3 py-5"
        aria-label="Main navigation"
      >
        <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Workspace
        </p>

        <div className="space-y-1">
          {visibleItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                    isActive
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                  ].join(" ")
                }
              >
                <Icon className="h-4.5 w-4.5 shrink-0" />

                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* User / Logout */}
      <div className="border-t border-slate-200 p-3">
        <div className="mb-2 rounded-lg bg-slate-50 px-3 py-3">
          <p className="truncate text-sm font-medium text-slate-900">
            {user?.fullName}
          </p>

          <p className="mt-0.5 truncate text-xs text-slate-500">
            {user?.email}
          </p>

          <p className="mt-2 inline-flex rounded-md bg-white px-2 py-1 text-[11px] font-medium capitalize text-slate-600 ring-1 ring-slate-200">
            {user?.role.replace("_", " ")}
          </p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-700"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}