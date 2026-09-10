import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export default function ErrorState({
  title = "Something went wrong",
  message = "We were unable to load the requested information.",
  onRetry,
  retryLabel = "Try Again",
}: ErrorStateProps) {
  return (
    <div
      className="rounded-xl border border-red-200 bg-red-50 p-6"
      role="alert"
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0">
          <AlertCircle
            className="h-5 w-5 text-red-600"
            aria-hidden="true"
          />
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="text-base font-semibold text-red-800">
            {title}
          </h2>

          <p className="mt-1 text-sm leading-6 text-red-700">
            {message}
          </p>

          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              <RefreshCw className="h-4 w-4" />
              {retryLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}