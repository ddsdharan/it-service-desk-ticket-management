import { z } from "zod";

export const ticketSchema = z.object({
  subject: z
    .string()
    .trim()
    .min(1, "Subject is required.")
    .max(150, "Subject must be 150 characters or less."),

  description: z
    .string()
    .trim()
    .min(20, "Description must be at least 20 characters.")
    .max(
      2000,
      "Description must be 2000 characters or less."
    ),

  categoryId: z
    .string()
    .min(1, "Please select a category."),

  priority: z.enum([
    "low",
    "medium",
    "high",
    "critical",
  ]),

  preferredContactMethod: z.enum([
    "email",
    "phone",
    "chat",
  ]),
});

export type TicketFormValues = z.infer<typeof ticketSchema>;