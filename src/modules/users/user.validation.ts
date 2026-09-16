import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const updateProfileSchema = z
  .object({
    fullName: z
      .string()
      .min(2)
      .max(100)
      .trim()
      .optional(),

    username: z
      .string()
      .min(3)
      .max(30)
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers and underscores"
      )
      .trim()
      .toLowerCase()
      .optional(),

    bio: z
      .string()
      .max(500)
      .trim()
      .optional(),

    experience: z
      .string()
      .max(2000)
      .trim()
      .optional(),

    skills: z
      .array(
        z
          .string()
          .trim()
          .min(1)
          .max(50)
      )
      .max(30)
      .optional(),

    githubUsername: z
      .string()
      .trim()
      .max(100)
      .optional(),

    linkedinUrl: z
      .string()
      .url()
      .optional(),

    portfolioUrl: z
      .string()
      .url()
      .optional(),

    profileImage: z
      .string()
      .url()
      .optional(),
  })
  .strict();

export const developerIdSchema = z.object({
  id: z
    .string()
    .refine((val) => objectIdRegex.test(val), {
      message: "Invalid developer ID",
    }),
});

export const getDevelopersQuerySchema = z.object({
  search: z.string().trim().max(100).optional(),
  skill: z.string().trim().max(50).optional(),
  page: z
    .string()
    .optional()
    .transform((val) =>
      val ? Math.max(Number(val), 1) : 1
    ),
  limit: z
    .string()
    .optional()
    .transform((val) =>
      val
        ? Math.min(Math.max(Number(val), 1), 50)
        : 12
    ),
});

export type UpdateProfileInput = z.infer<
  typeof updateProfileSchema
>;

export type DeveloperIdInput = z.infer<
  typeof developerIdSchema
>;

export type GetDevelopersQueryInput = z.infer<
  typeof getDevelopersQuerySchema
>;