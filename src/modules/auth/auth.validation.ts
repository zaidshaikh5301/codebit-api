import { z } from "zod";

export const signupSchema =
  z.object({
    email: z
      .string()
      .email()
      .trim()
      .toLowerCase(),

    password: z
      .string()
      .min(
        8,
        "Password must be at least 8 characters"
      )
      .max(100),

    fullName: z
      .string()
      .min(2)
      .max(100)
      .trim(),
  });

export const loginSchema =
  z.object({
    email: z
      .string()
      .email()
      .trim()
      .toLowerCase(),

    password: z
      .string()
      .min(1),
  });

export type SignupInput =
  z.infer<
    typeof signupSchema
  >;

export type LoginInput =
  z.infer<
    typeof loginSchema
  >;