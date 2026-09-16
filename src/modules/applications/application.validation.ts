import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const createApplicationSchema = z
  .object({
    projectId: z
      .string()
      .refine((val) => objectIdRegex.test(val), {
        message: "Invalid project ID",
      }),

    coverLetter: z
      .string()
      .min(10)
      .max(500)
      .trim()
      .optional(),
  })
  .strict();

export const applicationIdSchema = z.object({
  id: z
    .string()
    .refine((val) => objectIdRegex.test(val), {
      message: "Invalid application ID",
    }),
});

export type CreateApplicationInput = z.infer<
  typeof createApplicationSchema
>;

export type ApplicationIdInput = z.infer<
  typeof applicationIdSchema
>;