import { LoaderCircle } from "lucide-react";

interface LoadingStateProps {
  rows?: number;
  message?: string;
  fullHeight?: boolean;
}

export default function LoadingState({
  rows = 4,
  message,
  fullHeight = false,
}: LoadingStateProps) {
  return (
    <div
      className={`space-y-3 ${
        fullHeight
          ? "flex min-h-[60vh] flex-col justify-center"
          : ""
      }`}
      role="status"
      aria-live="polite"
    >
      {message && (
        <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
          <LoaderCircle
            className="h-4 w-4 animate-spin text-blue-600"
            aria-hidden="true"
          />
          {message}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="space-y-0 divide-y divide-slate-100">
          {Array.from({ length: rows }).map(
            (_, index) => (
              <div
                key={index}
                className="flex items-center gap-4 px-5 py-4"
              >
                <div className="h-4 w-10 animate-pulse rounded bg-slate-200" />

                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-slate-100" />
                </div>

                <div className="hidden h-8 w-20 animate-pulse rounded-lg bg-slate-100 sm:block" />
              </div>
            ),
          )}
        </div>
      </div>

      {!message && (
        <div className="flex items-center justify-center gap-2 pt-2 text-sm text-slate-400">
          <LoaderCircle
            className="h-4 w-4 animate-spin"
            aria-hidden="true"
          />
          Loading...
        </div>
      )}
    </div>
  );
}