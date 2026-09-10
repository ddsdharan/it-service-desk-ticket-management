import type { ReactNode } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  FileText,
  MessageSquare,
  Phone,
  Send,
} from "lucide-react";
import {
  Controller,
  useForm,
} from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { categoryService } from "../../services/categoryService";
import { ticketService } from "../../services/ticketService";
import { useAuth } from "../../hooks/useAuth";

import { useToast } from "../../app/providers/toast-context";

import type {
  ContactMethod,
  TicketPriority,
} from "../../types/ticket";

import {
  ticketSchema,
  type TicketFormValues,
} from "./ticketSchema";


export default function CreateTicketPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { showToast } = useToast();

  const {
  data: categories = [],
  isLoading: isCategoriesLoading,
  isError: isCategoriesError,
} = useQuery({
  queryKey: ["categories"],
  queryFn: async () => {
    const response = await categoryService.getCategories();

    return response.filter(
      (category) => category.status === "active"
    );
  },
});

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<TicketFormValues>({
    resolver: zodResolver(ticketSchema),

    defaultValues: {
      subject: "",
      description: "",
      categoryId: "",
      priority: "medium",
      preferredContactMethod: "email",
    },
  });

  const createTicketMutation = useMutation({
    mutationFn: async (values: TicketFormValues) => {
      if (!user) {
        throw new Error("You must be signed in to create a ticket.");
      }

      const now = new Date().toISOString();

      return ticketService.createTicket({
        id: `TKT-${Date.now()}`,
        subject: values.subject.trim(),
        description: values.description.trim(),
        createdBy: user.id,
        assignedAgent: null,
        categoryId: values.categoryId,
        priority: values.priority as TicketPriority,
        status: "open",
        preferredContactMethod: values.preferredContactMethod as ContactMethod,
        createdAt: now,
        updatedAt: now,
        dueDate: null,
        resolution: null,
        resolutionNotes: null,
        resolutionDate: null,
      });
    },

    onSuccess: async (createdTicket) => {
      await queryClient.invalidateQueries({
        queryKey: ["tickets"],
      });

      reset();

      showToast({
        variant: "success",
        title: "Ticket created", 
        message: `Ticket ${createdTicket.id} was created successfully.`,
      });

      navigate("/app/tickets", {
        replace: true,
        state: {
          successMessage:
            "Ticket created successfully.",
        },
      });
    },
    
  onError: (error) => {
    showToast({
      variant: "error",
      title: "Ticket creation failed",
      message:
        error instanceof Error
          ? error.message
          : "Unable to create the ticket. Please try again.",
    });
  },
});

  function onSubmit(values: TicketFormValues) {
    createTicketMutation.mutate(values);
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-7">
          <Link
            to="/app/tickets"
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Tickets
          </Link>

          <p className="text-sm font-medium text-slate-500">
            Service Desk
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Create Ticket
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Submit a new IT service request to the support team.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          {/* Request details */}
          <div className="border-b border-slate-200 p-5 sm:p-7">
            <div className="mb-6">
              <h2 className="text-base font-semibold text-slate-900">
                Request Details
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Provide enough information for the support team
                to understand your request.
              </p>
            </div>

            {/* Subject */}
            <div>
              <label
                htmlFor="subject"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Subject
                <span className="ml-1 text-red-500">*</span>
              </label>

              <input
                id="subject"
                type="text"
                {...register("subject")}
                placeholder="Briefly describe your issue"
                aria-invalid={Boolean(errors.subject)}
                className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition ${
                  errors.subject
                    ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                    : "border-slate-300 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                }`}
              />

              {errors.subject && (
                <p className="mt-1.5 text-xs text-red-600">
                  {errors.subject.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="mt-5">
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Description
                <span className="ml-1 text-red-500">*</span>
              </label>

              <div className="relative">
                <FileText className="absolute left-3 top-3 h-4 w-4 text-slate-400" />

                <textarea
                  id="description"
                  rows={7}
                  {...register("description")}
                  placeholder="Describe the issue, what you were doing when it occurred, and any relevant details..."
                  aria-invalid={Boolean(errors.description)}
                  className={`w-full resize-y rounded-lg border py-2.5 pl-10 pr-3 text-sm outline-none transition ${
                    errors.description
                      ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                      : "border-slate-300 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                  }`}
                />
              </div>

              {errors.description && (
                <p className="mt-1.5 text-xs text-red-600">
                  {errors.description.message}
                </p>
              )}

              <p className="mt-1.5 text-xs text-slate-400">
                Minimum 20 characters.
              </p>
            </div>

            {/* Category + Priority */}
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor="categoryId"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Category
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <select
                  id="categoryId"
                  {...register("categoryId")}
                  disabled={isCategoriesLoading}
                  aria-invalid={Boolean(errors.categoryId)}
                  className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none transition ${
                    errors.categoryId
                      ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                      : "border-slate-300 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                  } disabled:cursor-not-allowed disabled:bg-slate-50`}
                >
                  <option value="">
                    {isCategoriesLoading
                      ? "Loading categories..."
                      : "Select category"}
                  </option>

                  {categories.map((category) => (
                    <option
                      key={category.id}
                      value={category.id}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>

                {errors.categoryId && (
                  <p className="mt-1.5 text-xs text-red-600">
                    {errors.categoryId.message}
                  </p>
                )}

                {isCategoriesError && (
                  <p className="mt-1.5 text-xs text-red-600">
                    Unable to load categories.
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="priority"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Priority
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <select
                  id="priority"
                  {...register("priority")}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>

                {errors.priority && (
                  <p className="mt-1.5 text-xs text-red-600">
                    {errors.priority.message}
                  </p>
                )}
              </div>
            </div>

            {/* Contact method */}
            <div className="mt-5">
              <label className="mb-3 block text-sm font-medium text-slate-700">
                Preferred Contact Method
                <span className="ml-1 text-red-500">*</span>
              </label>

              <Controller
                name="preferredContactMethod"
                control={control}
                render={({ field }) => (
                  <div className="grid gap-3 sm:grid-cols-3">
                    <ContactOption
                      value="email"
                      label="Email"
                      icon={<Send className="h-4 w-4" />}
                      selected={field.value === "email"}
                      onSelect={() =>
                        field.onChange("email")
                      }
                    />

                    <ContactOption
                      value="phone"
                      label="Phone"
                      icon={<Phone className="h-4 w-4" />}
                      selected={field.value === "phone"}
                      onSelect={() =>
                        field.onChange("phone")
                      }
                    />

                    <ContactOption
                      value="chat"
                      label="Chat"
                      icon={
                        <MessageSquare className="h-4 w-4" />
                      }
                      selected={field.value === "chat"}
                      onSelect={() =>
                        field.onChange("chat")
                      }
                    />
                  </div>
                )}
              />

              {errors.preferredContactMethod && (
                <p className="mt-1.5 text-xs text-red-600">
                  {errors.preferredContactMethod.message}
                </p>
              )}
            </div>
          </div>

          {/* Requester information */}
          <div className="border-b border-slate-200 bg-slate-50/60 p-5 sm:p-7">
            <h2 className="text-base font-semibold text-slate-900">
              Requester
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              This ticket will automatically be associated with
              your account.
            </p>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Name
                </p>

                <p className="mt-1 text-sm font-medium text-slate-900">
                  {user?.fullName}
                </p>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Email
                </p>

                <p className="mt-1 text-sm font-medium text-slate-900">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Form actions */}
          <div className="flex flex-col-reverse gap-3 p-5 sm:flex-row sm:items-center sm:justify-end sm:p-7">
            <Link
              to="/app/tickets"
              className="inline-flex justify-center rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={
                createTicketMutation.isPending ||
                isCategoriesLoading ||
                isCategoriesError
              }
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {createTicketMutation.isPending ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Creating...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Create Ticket
                </>
              )}
            </button>
          </div>

          {/* Mutation error */}
          {createTicketMutation.isError && (
            <div
              role="alert"
              className="mx-5 mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:mx-7 sm:mb-7"
            >
              {createTicketMutation.error instanceof Error
                ? createTicketMutation.error.message
                : "Unable to create the ticket. Please try again."}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

interface ContactOptionProps {
  value: "email" | "phone" | "chat";
  label: string;
  icon: ReactNode;
  selected: boolean;
  onSelect: () => void;
}

function ContactOption({
  value,
  label,
  icon,
  selected,
  onSelect,
}: ContactOptionProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-left transition ${
        selected
          ? "border-slate-900 bg-slate-50 text-slate-900 ring-1 ring-slate-900"
          : "border-slate-300 bg-white text-slate-600 hover:border-slate-400 hover:bg-slate-50"
      }`}
    >
      <span
        className={`flex h-8 w-8 items-center justify-center rounded-md ${
          selected
            ? "bg-slate-900 text-white"
            : "bg-slate-100 text-slate-500"
        }`}
      >
        {icon}
      </span>

      <span className="text-sm font-medium">
        {label}
      </span>

      <input
        type="radio"
        value={value}
        checked={selected}
        readOnly
        className="sr-only"
      />
    </button>
  );
}