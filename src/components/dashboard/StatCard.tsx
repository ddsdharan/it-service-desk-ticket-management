import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  description?: string;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  description,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-indigo-100 bg-white/90 p-5 shadow-[0_10px_30px_rgba(79,70,229,0.06)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(79,70,229,0.10)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-indigo-600">
            {title}
          </p>

          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-[2rem]">
            {value}
          </p>

          {description && (
            <p className="mt-1 text-xs text-slate-400">
              {description}
            </p>
          )}
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-sky-500 text-white shadow-lg shadow-indigo-500/20 ring-1 ring-indigo-100">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}