import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const projectIdParamSchema = z
  .object({
    projectId: z
      .string()
      .refine((val) => objectIdRegex.test(val), {
        message: "Invalid project ID",
      }),
  })
  .strict();

export type ProjectIdParamInput = z.infer<
  typeof projectIdParamSchema
>;