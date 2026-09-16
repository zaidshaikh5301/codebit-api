import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const createTaskSchema = z
  .object({
    title: z.string().min(1).max(200).trim(),

    description: z.string().min(1).max(2000).trim(),

    priority: z.enum(["epic", "high", "medium", "low"]),

    projectId: z
      .string()
      .refine((val) => objectIdRegex.test(val), {
        message: "Invalid project ID",
      }),

    assignee: z
      .string()
      .refine((val) => objectIdRegex.test(val), {
        message: "Invalid assignee ID",
      })
      .optional(),

    dueDate: z
      .string()
      .transform((val) => new Date(val))
      .optional(),
  })
  .strict();

export const updateTaskSchema = z
  .object({
    description: z.string().min(1).max(2000).trim().optional(),

    priority: z.enum(["epic", "high", "medium", "low"]).optional(),
  })
  .strict();

export const updateTaskStatusSchema = z
  .object({
    status: z.enum(["pending", "in-progress", "completed"]),
  })
  .strict();

export const taskIdSchema = z.object({
  id: z
    .string()
    .refine((val) => objectIdRegex.test(val), {
      message: "Invalid task ID",
    }),
});

export const listTasksQuerySchema = z.object({
  projectId: z
    .string()
    .refine((val) => objectIdRegex.test(val), {
      message: "Invalid project ID",
    })
    .optional(),
  priority: z.enum(["epic", "high", "medium", "low"]).optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;

export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;

export type UpdateTaskStatusInput = z.infer<typeof updateTaskStatusSchema>;

export type TaskIdInput = z.infer<typeof taskIdSchema>;

export type ListTasksQueryInput = z.infer<typeof listTasksQuerySchema>;