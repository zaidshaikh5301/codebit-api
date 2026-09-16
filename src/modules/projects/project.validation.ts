import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const createProjectSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100)
      .trim(),

    description: z
      .string()
      .min(10)
      .max(1000)
      .trim(),

    technologies: z
      .array(
        z
          .string()
          .trim()
          .min(1)
          .max(50)
      )
      .min(1, "At least one technology is required")
      .max(30),

    status: z
      .enum(["planning", "active", "completed"])
      .optional()
      .default("planning"),
  })
  .strict();

export const updateProjectSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100)
      .trim()
      .optional(),

    description: z
      .string()
      .min(10)
      .max(1000)
      .trim()
      .optional(),

    technologies: z
      .array(
        z
          .string()
          .trim()
          .min(1)
          .max(50)
      )
      .min(1, "At least one technology is required")
      .max(30)
      .optional(),

    status: z
      .enum(["planning", "active", "completed"])
      .optional(),
  })
  .strict();

export const projectIdSchema = z.object({
  id: z
    .string()
    .refine((val) => objectIdRegex.test(val), {
      message: "Invalid project ID",
    }),
});

export type CreateProjectInput = z.infer<
  typeof createProjectSchema
>;

export type UpdateProjectInput = z.infer<
  typeof updateProjectSchema
>;

export type ProjectIdInput = z.infer<
  typeof projectIdSchema
>;