import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface TicketPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export default function TicketPagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}: TicketPaginationProps) {
  if (totalItems === 0) {
    return null;
  }

  const startItem =
    (currentPage - 1) * pageSize + 1;

  const endItem = Math.min(
    currentPage * pageSize,
    totalItems,
  );

  const getPageNumbers = () => {
    const pages: number[] = [];

    const start = Math.max(
      1,
      currentPage - 2,
    );

    const end = Math.min(
      totalPages,
      currentPage + 2,
    );

    for (let page = start; page <= end; page++) {
      pages.push(page);
    }

    return pages;
  };

  return (
    <div className="flex flex-col gap-4 border-t border-slate-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-500">
        Showing{" "}
        <span className="font-semibold text-slate-700">
          {startItem}
        </span>{" "}
        to{" "}
        <span className="font-semibold text-slate-700">
          {endItem}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-slate-700">
          {totalItems}
        </span>{" "}
        tickets
      </p>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {getPageNumbers().map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            aria-current={page === currentPage ? "page" : undefined}
            className={`inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-sm font-medium transition ${
              page === currentPage
                ? "bg-slate-900 text-white shadow-sm"
                : "border border-slate-300 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}