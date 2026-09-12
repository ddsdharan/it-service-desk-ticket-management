import { useMemo, useState } from "react";

import {
  Edit3,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  UserCheck,
  UserX,
  Users,
  X,
} from "lucide-react";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { userService } from "../../services/userService";
import { useToast } from "../../app/providers/toast-context";

import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import LoadingState from "../../components/common/LoadingState";

import type {
  User,
  UserRole,
  UserStatus,
} from "../../types/user";

import UserForm from "../../components/users/UserForm";
import UserRoleBadge from "../../components/users/UserRoleBadge";
import UserStatusBadge from "../../components/users/UserStatusBadge";

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

const roleLabels: Record<UserRole, string> = {
  admin: "Admin",
  support_agent: "Support Agent",
  employee: "Employee",
};

export default function UsersPage() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] =
    useState<User | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteUser, setDeleteUser] =
    useState<User | null>(null);

  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: userService.getUsers,
    staleTime: 30_000,
    retry: 1,
  });

  const users = useMemo(
    () => usersQuery.data ?? [],
    [usersQuery.data],
  );

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return users;
    }

    return users.filter((user) =>
      [
        user.id,
        user.fullName,
        user.email,
        user.phone,
        user.department,
        roleLabels[user.role],
        user.status,
      ].some((value) =>
        value.toLowerCase().includes(query),
      ),
    );
  }, [users, search]);

  const saveMutation = useMutation({
    mutationFn: async ({
      user,
      data,
    }: {
      user: User | null;
      data: Omit<User, "id">;
    }) => {
      if (user) {
        const updateData: Partial<User> = {
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          department: data.department,
          role: data.role,
          status: data.status,
        };

        if (data.password.trim()) {
          updateData.password = data.password;
        }

        return userService.updateUser(
          user.id,
          updateData,
        );
      }

      return userService.createUser({
        ...data,
        createdAt:
          data.createdAt ||
          new Date().toISOString(),
      });
    },

    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ["users"],
      });

      setIsFormOpen(false);
      setSelectedUser(null);

      showToast({
        variant: "success",
        title: variables.user
          ? "User updated"
          : "User created",
        message: variables.user
          ? "The user was updated successfully."
          : "The user was created successfully.",
      });
    },

    onError: (error) => {
      showToast({
        variant: "error",
        title: "User save failed",
        message:
          error instanceof Error
            ? error.message
            : "Unable to save the user. Please try again.",
      });
    },
  });

  const statusMutation = useMutation({
    mutationFn: async (user: User) => {
      const nextStatus: UserStatus =
        user.status === "active"
          ? "inactive"
          : "active";

      return userService.updateUser(user.id, {
        status: nextStatus,
      });
    },

    onSuccess: async (_, user) => {
      await queryClient.invalidateQueries({
        queryKey: ["users"],
      });

      showToast({
        variant: "success",
        title: "User status updated",
        message:
          user.status === "active"
            ? `${user.fullName} has been deactivated.`
            : `${user.fullName} has been activated.`,
      });
    },

    onError: (error) => {
      showToast({
        variant: "error",
        title: "User status update failed",
        message:
          error instanceof Error
            ? error.message
            : "Unable to update the user's status.",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      userService.deleteUser(id),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["users"],
      });

      setIsDeleteOpen(false);
      setDeleteUser(null);

      showToast({
        variant: "success",
        title: "User deleted",
        message:
          "The user was deleted successfully.",
      });
    },

    onError: (error) => {
      showToast({
        variant: "error",
        title: "User deletion failed",
        message:
          error instanceof Error
            ? error.message
            : "Unable to delete the user. Please try again.",
      });
    },
  });

  const openCreate = () => {
    setSelectedUser(null);
    setIsFormOpen(true);
  };

  const openEdit = (user: User) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const openDelete = (user: User) => {
    setDeleteUser(user);
    setIsDeleteOpen(true);
  };

  const closeForm = () => {
    if (saveMutation.isPending) {
      return;
    }

    setIsFormOpen(false);
    setSelectedUser(null);
  };

  const handleSave = (data: Omit<User, "id">) => {
    saveMutation.mutate({
      user: selectedUser,
      data,
    });
  };

  const handleStatusChange = (user: User) => {
    if (statusMutation.isPending) {
      return;
    }

    statusMutation.mutate(user);
  };

  const handleDelete = () => {
    if (
      !deleteUser ||
      deleteMutation.isPending
    ) {
      return;
    }

    deleteMutation.mutate(deleteUser.id);
  };

  if (usersQuery.isLoading) {
    return (
      <div className="space-y-6">
        <LoadingState rows={6} />
      </div>
    );
  }

  if (usersQuery.isError) {
    return (
      <ErrorState
        title="Unable to load users"
        message="The user list could not be loaded from the API. Please check that JSON Server is running and try again."
        onRetry={() => usersQuery.refetch()}
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
            <ShieldCheck
              size={24}
              className="text-blue-600"
            />

            <h1 className="text-2xl font-semibold text-slate-900">
              User Management
            </h1>
          </div>

          <p className="mt-1 text-sm text-slate-500">
            Manage users, roles, and account status.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
        >
          <Plus size={17} />
          Add User
        </button>
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
            placeholder="Search by name, email, department, role..."
            className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* Summary */}
      <div className="grid gap-4 grid-cols-2 xl:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Total Users
          </p>

          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {users.length}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Active Users
          </p>

          <p className="mt-2 text-2xl font-semibold text-emerald-600">
            {
              users.filter(
                (user) =>
                  user.status === "active",
              ).length
            }
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Support Agents
          </p>

          <p className="mt-2 text-2xl font-semibold text-blue-600">
            {
              users.filter(
                (user) =>
                  user.role === "support_agent",
              ).length
            }
          </p>
        </div>
      </div>

      {/* Table */}
      {filteredUsers.length === 0 ? (
        <EmptyState
          icon={Users}
          title={
            search.trim()
              ? "No matching users"
              : "No users found"
          }
          message={
            search.trim()
              ? "No users match your current search criteria. Try a different name, email, department, or role."
              : "There are currently no users in the service desk."
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
                Add User
              </button>
            )
          }
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    User
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Contact
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Department
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Role
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
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-medium text-slate-900">
                          {user.fullName}
                        </p>

                        <p className="mt-0.5 text-xs text-slate-400">
                          {user.id}
                        </p>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm text-slate-700">
                        {user.email}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {user.phone}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-700">
                      {user.department}
                    </td>

                    <td className="px-5 py-4">
                      <UserRoleBadge
                        role={user.role}
                      />
                    </td>

                    <td className="px-5 py-4">
                      <UserStatusBadge
                        status={user.status}
                      />
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {formatDate(user.createdAt)}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            openEdit(user)
                          }
                          title="Edit user"
                          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                        >
                          <Edit3 size={17} />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleStatusChange(user)
                          }
                          title={
                            user.status === "active"
                              ? "Deactivate user"
                              : "Activate user"
                          }
                          disabled={
                            statusMutation.isPending
                          }
                          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50"
                        >
                          {user.status ===
                          "active" ? (
                            <UserX size={17} />
                          ) : (
                            <UserCheck size={17} />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            openDelete(user)
                          }
                          title="Delete user"
                          className="rounded-lg p-2 text-red-500 hover:bg-red-50 hover:text-red-700"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* User Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {selectedUser
                    ? "Edit User"
                    : "Add User"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {selectedUser
                    ? "Update user information and permissions."
                    : "Create a new service desk user."}
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
              <UserForm
                key={
                  selectedUser?.id ?? "new-user"
                }
                user={selectedUser}
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
      {isDeleteOpen && deleteUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-600">
              <Trash2 size={20} />
            </div>

            <h2 className="mt-4 text-lg font-semibold text-slate-900">
              Delete user?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Are you sure you want to delete{" "}
              <span className="font-medium text-slate-700">
                {deleteUser.fullName}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteOpen(false);
                  setDeleteUser(null);
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
                  : "Delete User"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}