import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const projectIdSchema = z
  .object({
    id: z
      .string()
      .refine((val) => objectIdRegex.test(val), {
        message: "Invalid project ID",
      }),
  })
  .strict();

export const developerIdSchema = z
  .object({
    id: z
      .string()
      .refine((val) => objectIdRegex.test(val), {
        message: "Invalid developer ID",
      }),
  })
  .strict();

export type ProjectIdInput = z.infer<typeof projectIdSchema>;

export type DeveloperIdInput = z.infer<typeof developerIdSchema>;