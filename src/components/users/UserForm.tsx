import { useState } from "react";
import type { User, UserRole, UserStatus } from "../../types/user";

interface UserFormProps {
  user?: User | null;
  isSubmitting?: boolean;
  onSubmit: (data: Omit<User, "id">) => void;
  onCancel: () => void;
}

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  department: string;
  role: UserRole;
  status: UserStatus;
  password: string;
  createdAt: string;
}

const emptyForm: FormState = {
  fullName: "",
  email: "",
  phone: "",
  department: "",
  role: "employee",
  status: "active",
  password: "",
  createdAt: "",
};

export default function UserForm({
  user,
  isSubmitting = false,
  onSubmit,
  onCancel,
}: UserFormProps) {

    const [form, setForm] = useState<FormState>(() =>
  user
    ? {
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        department: user.department,
        role: user.role,
        status: user.status,
        password: "",
        createdAt: user.createdAt,
      }
    : {
        ...emptyForm,
        createdAt: new Date().toISOString(),
      },
    );
    const [errors, setErrors] = useState<Record<string, string>>({});
    const isEditing = Boolean(user);
    const updateField = <K extends keyof FormState>(
    field: K,
    value: FormState[K],
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [field]: "",
    }));
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};

    if (!form.fullName.trim()) {
      nextErrors.fullName = "Full name is required.";
    }

    if (!form.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
    ) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!form.phone.trim()) {
      nextErrors.phone = "Phone number is required.";
    } else if (!/^[0-9+\-\s()]{7,20}$/.test(form.phone)) {
      nextErrors.phone = "Enter a valid phone number.";
    }

    if (!form.department.trim()) {
      nextErrors.department = "Department is required.";
    }

    if (!isEditing && !form.password.trim()) {
      nextErrors.password = "Password is required.";
    }

    if (form.password && form.password.length < 6) {
      nextErrors.password =
        "Password must be at least 6 characters.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    onSubmit({
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      department: form.department.trim(),
      role: form.role,
      status: form.status,
      password: form.password,
      createdAt: form.createdAt || new Date().toISOString(),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Full Name
          </label>

          <input
            value={form.fullName}
            onChange={(event) =>
              updateField("fullName", event.target.value)
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            placeholder="Enter full name"
            disabled={isSubmitting}
          />

          {errors.fullName && (
            <p className="mt-1 text-xs text-red-600">
              {errors.fullName}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Email
          </label>

          <input
            type="email"
            value={form.email}
            onChange={(event) =>
              updateField("email", event.target.value)
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            placeholder="user@example.com"
            disabled={isSubmitting}
          />

          {errors.email && (
            <p className="mt-1 text-xs text-red-600">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Phone
          </label>

          <input
            value={form.phone}
            onChange={(event) =>
              updateField("phone", event.target.value)
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            placeholder="+91 9876543210"
            disabled={isSubmitting}
          />

          {errors.phone && (
            <p className="mt-1 text-xs text-red-600">
              {errors.phone}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Department
          </label>

          <input
            value={form.department}
            onChange={(event) =>
              updateField("department", event.target.value)
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            placeholder="IT"
            disabled={isSubmitting}
          />

          {errors.department && (
            <p className="mt-1 text-xs text-red-600">
              {errors.department}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Role
          </label>

          <select
            value={form.role}
            onChange={(event) =>
              updateField(
                "role",
                event.target.value as UserRole,
              )
            }
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            disabled={isSubmitting}
          >
            <option value="employee">Employee</option>
            <option value="support_agent">Support Agent</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Status
          </label>

          <select
            value={form.status}
            onChange={(event) =>
              updateField(
                "status",
                event.target.value as UserStatus,
              )
            }
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            disabled={isSubmitting}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Password
          </label>

          <input
            type="password"
            value={form.password}
            onChange={(event) =>
              updateField("password", event.target.value)
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            placeholder={
              isEditing
                ? "Leave unchanged or enter a new password"
                : "Enter password"
            }
            disabled={isSubmitting}
          />

          {errors.password && (
            <p className="mt-1 text-xs text-red-600">
              {errors.password}
            </p>
          )}
        </div>
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
            : isEditing
              ? "Update User"
              : "Create User"}
        </button>
      </div>
    </form>
  );
}