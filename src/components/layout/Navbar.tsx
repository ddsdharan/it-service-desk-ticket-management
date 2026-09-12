import { Bell, Menu } from "lucide-react";

import { useAuth } from "../../hooks/useAuth";

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({
  onMenuClick,
}: NavbarProps) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-20 flex h-20 w-full shrink-0 items-center justify-between border-b border-indigo-100 bg-white/85 px-4 shadow-[0_1px_0_rgba(79,70,229,0.08)] backdrop-blur-xl sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation"
          className="rounded-xl border border-indigo-100 bg-indigo-50 p-2.5 text-indigo-700 transition hover:border-indigo-200 hover:bg-indigo-100 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <button
          type="button"
          aria-label="Notifications"
          className="relative rounded-xl border border-indigo-100 bg-indigo-50 p-2.5 text-indigo-600 transition hover:border-indigo-200 hover:bg-indigo-100 hover:text-indigo-800"
        >
          <Bell className="h-5 w-5" />

          <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white" />
        </button>

        <div className="hidden h-7 w-px bg-indigo-100 sm:block" />

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-slate-900">
              {user?.fullName}
            </p>

            <p className="text-xs capitalize text-slate-500">
              {user?.role.replace("_", " ")}
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 via-violet-600 to-sky-500 text-sm font-semibold text-white shadow-sm shadow-indigo-500/20">
            {user?.fullName
              ?.split(" ")
              .map((name) => name[0])
              .slice(0, 2)
              .join("")
              .toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
}