import {
  AlertCircle,
  CheckCircle2,
  Info,
  X,
  AlertTriangle,
} from "lucide-react";

import type { Toast as ToastType } from "../../app/providers/toast-context";

interface ToastProps {
  toast: ToastType;
  onDismiss: (id: string) => void;
}

const variantConfig = {
  success: {
    icon: CheckCircle2,
    container:
      "border-emerald-200 bg-emerald-50 text-emerald-900",
    iconClass: "text-emerald-600",
  },

  error: {
    icon: AlertCircle,
    container:
      "border-red-200 bg-red-50 text-red-900",
    iconClass: "text-red-600",
  },

  warning: {
    icon: AlertTriangle,
    container:
      "border-amber-200 bg-amber-50 text-amber-900",
    iconClass: "text-amber-600",
  },

  info: {
    icon: Info,
    container:
      "border-blue-200 bg-blue-50 text-blue-900",
    iconClass: "text-blue-600",
  },
} as const;

export default function Toast({
  toast,
  onDismiss,
}: ToastProps) {
  const config = variantConfig[toast.variant];
  const Icon = config.icon;

  return (
    <div
      role={
        toast.variant === "error"
          ? "alert"
          : "status"
      }
      aria-live={
        toast.variant === "error"
          ? "assertive"
          : "polite"
      }
      className={`flex w-full max-w-sm items-start gap-3 rounded-xl border p-4 shadow-lg ${config.container}`}
    >
      <Icon
        className={`mt-0.5 h-5 w-5 shrink-0 ${config.iconClass}`}
      />

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">
          {toast.title}
        </p>

        {toast.message && (
          <p className="mt-1 text-sm opacity-80">
            {toast.message}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
        className="rounded-md p-1 opacity-60 transition hover:bg-black/5 hover:opacity-100"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}