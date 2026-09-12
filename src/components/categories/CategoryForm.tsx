import { useState } from "react";
import type {
  Category,
  CategoryStatus,
} from "../../types/category";

interface CategoryFormProps {
  category: Category | null;
  isSubmitting: boolean;
  onSubmit: (data: Omit<Category, "id">) => void;
  onCancel: () => void;
}

interface FormState {
  name: string;
  description: string;
  status: CategoryStatus;
  createdAt: string;
  updatedAt: string;
}

const emptyForm: FormState = {
  name: "",
  description: "",
  status: "active",
  createdAt: "",
  updatedAt: "",
};

export default function CategoryForm({
  category,
  isSubmitting,
  onSubmit,
  onCancel,
}: CategoryFormProps) {
  const [form, setForm] = useState<FormState>(() =>
    category
      ? {
          name: category.name,
          description: category.description,
          status: category.status,
          createdAt: category.createdAt,
          updatedAt: category.updatedAt,
        }
      : emptyForm,
  );

  const [error, setError] = useState("");

  const updateField = <K extends keyof FormState>(
    field: K,
    value: FormState[K],
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const name = form.name.trim();
    const description = form.description.trim();

    if (!name) {
      setError("Category name is required.");
      return;
    }

    if (name.length < 2) {
      setError("Category name must contain at least 2 characters.");
      return;
    }

    if (!description) {
      setError("Category description is required.");
      return;
    }

    const now = new Date().toISOString();

    onSubmit({
      name,
      description,
      status: form.status,
      createdAt: form.createdAt || now,
      updatedAt: now,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="category-name"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          Category Name
        </label>

        <input
          id="category-name"
          type="text"
          value={form.name}
          onChange={(event) =>
            updateField("name", event.target.value)
          }
          placeholder="e.g. Hardware"
          className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
        />
      </div>

      <div>
        <label
          htmlFor="category-description"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          Description
        </label>

        <textarea
          id="category-description"
          value={form.description}
          onChange={(event) =>
            updateField("description", event.target.value)
          }
          rows={4}
          placeholder="Describe what this category is used for..."
          className="w-full resize-none rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
        />
      </div>

      <div>
        <label
          htmlFor="category-status"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          Status
        </label>

        <select
          id="category-status"
          value={form.status}
          onChange={(event) =>
            updateField(
              "status",
              event.target.value as CategoryStatus,
            )
          }
          className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting
            ? "Saving..."
            : category
              ? "Update Category"
              : "Create Category"}
        </button>
      </div>
    </form>
  );
}