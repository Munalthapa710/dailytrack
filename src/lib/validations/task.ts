import { z } from "zod";

const baseTaskSchema = z.object({
  title: z.string().min(1, "Title is required.").max(120, "Title is too long."),
  description: z.string().max(1000, "Description is too long.").optional().or(z.literal("")),
  date: z.string().optional().or(z.literal("")),
  startTime: z.string().min(1, "Start time is required."),
  endTime: z.string().min(1, "End time is required."),
  isDaily: z.boolean().optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
  label: z.string().max(32, "Label is too long.").optional().or(z.literal("")),
  reminderMinutes: z.preprocess(
    (value) => (value === "" || value === undefined ? null : value),
    z.coerce.number().int().min(0).max(1440).nullable()
  ).optional(),
  status: z.enum(["pending", "completed", "missed"]).optional()
});

export const taskSchema = baseTaskSchema
  .refine(
    (values) => {
      return values.startTime < values.endTime;
    },
    {
      message: "End time must be later than start time.",
      path: ["endTime"]
    }
  );

export const taskUpdateSchema = baseTaskSchema.partial().refine(
  (values) => {
    if (!values.startTime || !values.endTime) {
      return true;
    }
    return values.startTime < values.endTime;
  },
  {
    message: "End time must be later than start time.",
    path: ["endTime"]
  }
);
