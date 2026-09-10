import { Link } from "react-router-dom";
import { ShieldX } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
          <ShieldX className="h-7 w-7 text-slate-600" />
        </div>

        <h1 className="text-2xl font-semibold text-slate-900">
          Access denied
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          You don't have permission to access this page.
        </p>

        <Link
          to="/app/dashboard"
          className="mt-6 inline-flex rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}