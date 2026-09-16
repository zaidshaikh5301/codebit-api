import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const githubUsernameSchema = z
  .object({
    username: z
      .string()
      .min(1)
      .max(100)
      .trim()
      .toLowerCase(),
  })
  .strict();

export const githubRepoUrlSchema = z
  .object({
    repoUrl: z.string().url().trim(),
  })
  .strict();

export const projectIdSchema = z
  .object({
    id: z
      .string()
      .refine((val) => objectIdRegex.test(val), {
        message: "Invalid project ID",
      }),
  })
  .strict();

export type GithubUsernameInput = z.infer<
  typeof githubUsernameSchema
>;

export type GithubRepoUrlInput = z.infer<
  typeof githubRepoUrlSchema
>;

export type ProjectIdInput = z.infer<typeof projectIdSchema>;