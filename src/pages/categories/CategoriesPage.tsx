import { useMemo, useState } from "react";

import {
  Edit3,
  FolderKanban,
  Plus,
  Search,
  Trash2,
  ToggleLeft,
  ToggleRight,
  X,
} from "lucide-react";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { categoryService } from "../../services/categoryService";
import { useToast } from "../../app/providers/toast-context";

import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import LoadingState from "../../components/common/LoadingState";

import type {
  Category,
  CategoryStatus,
} from "../../types/category";

import CategoryStatusBadge from "../../components/categories/CategoryStatusBadge";
import CategoryForm from "../../components/categories/CategoryForm";

const formatDate = (
  value: string | null | undefined,
) => {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
  }).format(date);
};

export default function CategoriesPage() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<Category | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] =
    useState(false);
  const [deleteCategory, setDeleteCategory] =
    useState<Category | null>(null);

  /*
   * Load categories
   */
  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: categoryService.getCategories,
    staleTime: 30_000,
    retry: 1,
  });

  const categories = useMemo(
    () => categoriesQuery.data ?? [],
    [categoriesQuery.data],
  );

  /*
   * Search
   */
  const filteredCategories = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return categories;
    }

    return categories.filter((category) =>
      [
        category.id,
        category.name,
        category.description,
        category.status,
      ].some((value) =>
        value.toLowerCase().includes(query),
      ),
    );
  }, [categories, search]);

  /*
   * Create / Update
   */
  const saveMutation = useMutation({
    mutationFn: async ({
      category,
      data,
    }: {
      category: Category | null;
      data: Omit<Category, "id">;
    }) => {
      if (category) {
        return categoryService.updateCategory(
          category.id,
          {
            name: data.name,
            description: data.description,
            status: data.status,
            updatedAt: new Date().toISOString(),
          },
        );
      }

      const now = new Date().toISOString();

      return categoryService.createCategory({
        ...data,
        createdAt: data.createdAt || now,
        updatedAt: now,
      });
    },

    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ["categories"],
      });

      setIsFormOpen(false);
      setSelectedCategory(null);

      showToast({
        variant: "success",
        title: variables.category
          ? "Category updated"
          : "Category created",
        message: variables.category
          ? "The category was updated successfully."
          : "The category was created successfully.",
      });
    },

    onError: (error) => {
      showToast({
        variant: "error",
        title: "Category save failed",
        message:
          error instanceof Error
            ? error.message
            : "Unable to save the category. Please try again.",
      });
    },
  });

  /*
   * Activate / Deactivate
   */
  const statusMutation = useMutation({
    mutationFn: async (category: Category) => {
      const nextStatus: CategoryStatus =
        category.status === "active"
          ? "inactive"
          : "active";

      return categoryService.updateCategory(
        category.id,
        {
          status: nextStatus,
          updatedAt: new Date().toISOString(),
        },
      );
    },

    onSuccess: async (_, category) => {
      await queryClient.invalidateQueries({
        queryKey: ["categories"],
      });

      showToast({
        variant: "success",
        title: "Category status updated",
        message:
          category.status === "active"
            ? `${category.name} has been deactivated.`
            : `${category.name} has been activated.`,
      });
    },

    onError: (error) => {
      showToast({
        variant: "error",
        title: "Category status update failed",
        message:
          error instanceof Error
            ? error.message
            : "Unable to update the category status.",
      });
    },
  });

  /*
   * Delete
   */
  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      categoryService.deleteCategory(id),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["categories"],
      });

      setIsDeleteOpen(false);
      setDeleteCategory(null);

      showToast({
        variant: "success",
        title: "Category deleted",
        message:
          "The category was deleted successfully.",
      });
    },

    onError: (error) => {
      showToast({
        variant: "error",
        title: "Category deletion failed",
        message:
          error instanceof Error
            ? error.message
            : "Unable to delete the category. Please try again.",
      });
    },
  });

  /*
   * Actions
   */
  const openCreate = () => {
    setSelectedCategory(null);
    setIsFormOpen(true);
  };

  const openEdit = (category: Category) => {
    setSelectedCategory(category);
    setIsFormOpen(true);
  };

  const openDelete = (category: Category) => {
    setDeleteCategory(category);
    setIsDeleteOpen(true);
  };

  const closeForm = () => {
    if (saveMutation.isPending) {
      return;
    }

    setIsFormOpen(false);
    setSelectedCategory(null);
  };

  const handleSave = (
    data: Omit<Category, "id">,
  ) => {
    saveMutation.mutate({
      category: selectedCategory,
      data,
    });
  };

  const handleStatusChange = (
    category: Category,
  ) => {
    if (statusMutation.isPending) {
      return;
    }

    statusMutation.mutate(category);
  };

  const handleDelete = () => {
    if (
      !deleteCategory ||
      deleteMutation.isPending
    ) {
      return;
    }

    deleteMutation.mutate(deleteCategory.id);
  };

  /*
   * Loading
   */
  if (categoriesQuery.isLoading) {
    return (
      <div className="space-y-6">
        <LoadingState rows={7} />
      </div>
    );
  }

  /*
   * Error
   */
  if (categoriesQuery.isError) {
    return (
      <ErrorState
        title="Unable to load categories"
        message="The category list could not be loaded from the API. Please check that JSON Server is running and try again."
        onRetry={() => categoriesQuery.refetch()}
        retryLabel="Try again"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <FolderKanban
              size={24}
              className="text-blue-600"
            />

            <h1 className="text-2xl font-semibold text-slate-900">
              Category Management
            </h1>
          </div>

          <p className="mt-1 text-sm text-slate-500">
            Manage ticket categories and their
            availability.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
        >
          <Plus size={17} />
          Add Category
        </button>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Total Categories
          </p>

          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {categories.length}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Active Categories
          </p>

          <p className="mt-2 text-2xl font-semibold text-emerald-600">
            {
              categories.filter(
                (category) =>
                  category.status === "active",
              ).length
            }
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Inactive Categories
          </p>

          <p className="mt-2 text-2xl font-semibold text-slate-600">
            {
              categories.filter(
                (category) =>
                  category.status === "inactive",
              ).length
            }
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="search"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search by category name, description..."
            className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* Category Table / Empty State */}
      {filteredCategories.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title={
            search.trim()
              ? "No matching categories"
              : "No categories found"
          }
          message={
            search.trim()
              ? "No categories match your current search criteria. Try a different category name or description."
              : "There are currently no ticket categories in the service desk."
          }
          action={
            search.trim() ? (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Clear search
              </button>
            ) : (
              <button
                type="button"
                onClick={openCreate}
                className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                <Plus className="h-4 w-4" />
                Add Category
              </button>
            )
          }
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px]">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Category
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Description
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Created
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredCategories.map(
                  (category) => (
                    <tr
                      key={category.id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-5 py-4">
                        <div>
                          <p className="font-medium text-slate-900">
                            {category.name}
                          </p>

                          <p className="mt-0.5 text-xs text-slate-400">
                            ID: {category.id}
                          </p>
                        </div>
                      </td>

                      <td className="max-w-md px-5 py-4">
                        <p className="text-sm text-slate-600">
                          {category.description}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <CategoryStatusBadge
                          status={category.status}
                        />
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {formatDate(
                          category.createdAt,
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          {/* Edit */}
                          <button
                            type="button"
                            onClick={() =>
                              openEdit(category)
                            }
                            title="Edit category"
                            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                          >
                            <Edit3 size={17} />
                          </button>

                          {/* Status */}
                          <button
                            type="button"
                            onClick={() =>
                              handleStatusChange(
                                category,
                              )
                            }
                            disabled={
                              statusMutation.isPending
                            }
                            title={
                              category.status ===
                              "active"
                                ? "Deactivate category"
                                : "Activate category"
                            }
                            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50"
                          >
                            {category.status ===
                            "active" ? (
                              <ToggleRight
                                size={19}
                              />
                            ) : (
                              <ToggleLeft
                                size={19}
                              />
                            )}
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() =>
                              openDelete(category)
                            }
                            title="Delete category"
                            className="rounded-lg p-2 text-red-500 hover:bg-red-50 hover:text-red-700"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Category Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {selectedCategory
                    ? "Edit Category"
                    : "Add Category"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {selectedCategory
                    ? "Update category information and availability."
                    : "Create a new ticket category."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <CategoryForm
                key={
                  selectedCategory?.id ??
                  "new-category"
                }
                category={selectedCategory}
                isSubmitting={
                  saveMutation.isPending
                }
                onSubmit={handleSave}
                onCancel={closeForm}
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {isDeleteOpen && deleteCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-600">
              <Trash2 size={20} />
            </div>

            <h2 className="mt-4 text-lg font-semibold text-slate-900">
              Delete category?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Are you sure you want to delete{" "}
              <span className="font-medium text-slate-700">
                {deleteCategory.name}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteOpen(false);
                  setDeleteCategory(null);
                }}
                disabled={
                  deleteMutation.isPending
                }
                className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={
                  deleteMutation.isPending
                }
                className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleteMutation.isPending
                  ? "Deleting..."
                  : "Delete Category"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}